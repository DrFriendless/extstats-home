import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";
import {BucketAccessControl, type IBucket} from "aws-cdk-lib/aws-s3";
import * as cf from "aws-cdk-lib/aws-cloudfront";
import {
  AllowedMethods,
  CachedMethods,
  CachePolicy,
  Distribution,
  FunctionEventType,
  type IDistribution,
  OriginAccessIdentity,
  OriginProtocolPolicy,
  OriginRequestPolicy,
  ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as r53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import {HttpOrigin, S3BucketOrigin} from "aws-cdk-lib/aws-cloudfront-origins";

const LIVE_BUCKET_NAME = "extstats-drfriendless-com";
const TEST_BUCKET_NAME = "test-drfriendless-com";

let LIVE_BUCKET: s3.IBucket | undefined;
let TEST_BUCKET: s3.IBucket | undefined;
let TEST_DISTRIBUTION: cf.IDistribution | undefined;
let LIVE_DISTRIBUTION: cf.IDistribution | undefined;
let STAR_CERT: acm.ICertificate | undefined;
let STAR_CERT_GLOBAL: acm.ICertificate | undefined;
let DRFRIENDLESS_ZONE: r53.IHostedZone | undefined;
let API_REWRITE_FUNCTION: cf.IFunction | undefined;

export class StatsSiteStack extends cdk.Stack {
  defineTestBucket(): IBucket {
    return new s3.Bucket(this, "testBucket", {
      bucketName: TEST_BUCKET_NAME,
      accessControl: BucketAccessControl.PRIVATE
    });
  }

  defineLiveBucket(): IBucket {
    return new s3.Bucket(this, "liveBucket", {
      bucketName: LIVE_BUCKET_NAME,
      accessControl: BucketAccessControl.PRIVATE
    });
  }

  defineCloudFront(id: string, bucket: IBucket, domainName: string, hostName: string, comment: string,
                   suffix: string): IDistribution {
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity' + suffix);
    bucket.grantRead(originAccessIdentity);

    const d = new Distribution(this, id, {
      defaultRootObject: 'index.html',
      comment: comment,
      enabled: true,
      domainNames: [domainName],
      enableIpv6: true,
      certificate: STAR_CERT_GLOBAL,
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessIdentity(bucket, {
          originAccessIdentity
        }),
      },
      additionalBehaviors: {
        "/api/*": {
          compress: true,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: AllowedMethods.ALLOW_ALL,
          cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
          cachePolicy: CachePolicy.CACHING_DISABLED,
          functionAssociations: [{
            function: API_REWRITE_FUNCTION!,
            eventType: FunctionEventType.VIEWER_REQUEST
          }],
          originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          origin: new HttpOrigin("api.drfriendless.com", {
            protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
            httpsPort: 443,
            httpPort: 80,
          })
        }
      }
    });
    new r53.AaaaRecord(this, "aaaa_rec" + suffix, {
      recordName: hostName,
      zone: DRFRIENDLESS_ZONE!,
      target: r53.RecordTarget.fromAlias(new targets.CloudFrontTarget(d)) });
    new r53.ARecord(this, "a_rec" + suffix, {
      recordName: hostName,
      zone: DRFRIENDLESS_ZONE!,
      target: r53.RecordTarget.fromAlias(new targets.CloudFrontTarget(d)) });
    return d;
  }

  lookupExternalResources() {
    // resources external to this stack
    STAR_CERT = acm.Certificate.fromCertificateArn(this, "starCert", "arn:aws:acm:ap-southeast-2:067508173724:certificate/aabe3460-bdd1-432c-863e-74514b1fa94b");
    STAR_CERT_GLOBAL = acm.Certificate.fromCertificateArn(this, "starCertGlobal", "arn:aws:acm:us-east-1:067508173724:certificate/c49cd611-6dd6-418f-9323-0c975369bc8a");
    DRFRIENDLESS_ZONE = r53.HostedZone.fromLookup(this, "drfriendlessCom", { domainName: "drfriendless.com" });
    API_REWRITE_FUNCTION = cf.Function.fromFunctionAttributes(this, "rewriteApiUrl", {
      functionArn: "arn:aws:cloudfront::067508173724:function/cf_rewrite_api_url",
      functionName: "cf_rewrite_api_url",
      functionRuntime: undefined
    });
  }

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const env = props?.env!;
    this.lookupExternalResources();
    TEST_BUCKET = this.defineTestBucket();
    LIVE_BUCKET = this.defineLiveBucket();
    // TEST_DISTRIBUTION = this.defineCloudFront("testDistribution", TEST_BUCKET, "test.drfriendless.com", "test",
    //     "Test version of the extstats site", "");
    LIVE_DISTRIBUTION = this.defineCloudFront("liveDistribution", LIVE_BUCKET, "extstats.drfriendless.com", "extstats",
        "Live version of the extstats site", "live");
  }
}