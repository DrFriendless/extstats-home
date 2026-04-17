import {allBlogPosts} from "./BlogPost.ts";

export class DocoDoc {
    url: string;
    title: string;
    description: string;
    tags: string[];

    constructor(private p: any) {
        this.url = p.url;
        this.title = p.frontmatter.title;
        this.tags = p.frontmatter.tags || [];
        this.description = p.frontmatter.description;
        if (this.tags.length === 0) this.tags.push("unspecified");
    }

    correctUrl() {
        const s = this.url;
        return s + ".html";
    }

    hasTag(tag: string | undefined) {
        return ((tag !== "unspecified") && this.p.frontmatter.tags.indexOf(tag) >= 0) ||
            (((tag === "unspecified") || !tag) && !this.p.frontmatter.tags);
    }

    compareByTitle(other: DocoDoc): number {
        return cmp(this.title, other.title);
    }
}

function cmp(s1: string, s2: string) {
    if (s1 === s2) return 0;
    if (s1 < s2) return -1;
    return 1;
}

export function allDocoDocs(): DocoDoc[] {
    return Object.values(import.meta.glob('../pages/doco/*.mdx', { eager: true })).map(p => new DocoDoc(p));
}

export function allDocoTags(): string[] {
    const posts = allDocoDocs();
    const tags = [ "meta", "unspecified" ];

    for (const p of posts) {
        for (const t of p.tags) {
            if (tags.indexOf(t) < 0) tags.push(t);
        }
    }
    return tags;
}