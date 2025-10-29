export class BlogPost {
    private pd: string | undefined;
    url: string;
    title: string;
    tags: string[];

    constructor(private p: any) {
        this.url = p.url;
        this.title = p.frontmatter.title;
        this.tags = p.frontmatter.tags || [];
        if (this.tags.length === 0) this.tags.push("unspecified");
    }

    pubDate(): string {
        if (!this.pd) {
            const s = this.p.frontmatter.pubDate
            this.pd = s.slice(0, s.indexOf('T'));
        }
        return this.pd || "bob";
    }

    hasTag(tag: string | undefined) {
        return ((tag !== "unspecified") && this.p.frontmatter.tags.indexOf(tag) >= 0) ||
            (((tag === "unspecified") || !tag) && !this.p.frontmatter.tags);
    }

    compareByPubDate(other: BlogPost): number {
        return -cmp(this.pubDate(), other.pubDate());
    }

    isNew(): boolean {
        const today: Date = new Date();
        const t = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const td = days(t);
        return days(this.pubDate()) > td - 366;
    }
}

function cmp(s1: string, s2: string) {
    if (s1 === s2) return 0;
    if (s1 < s2) return -1;
    return 0;
}

function days(s: string) {
    const fields = s.split("-").map(x => parseInt(x));
    return fields[0] * 365 + (fields[1]-1) * 31 + fields[2];
}

export function allBlogPosts(): BlogPost[] {
    return Object.values(import.meta.glob('../pages/blog/*.mdx', { eager: true })).map(p => new BlogPost(p));
}

export function allBlogTags(): string[] {
    const posts = allBlogPosts();
    const tags = [ "meta", "unspecified" ];

    for (const p of posts) {
        for (const t of p.tags) {
            if (tags.indexOf(t) < 0) tags.push(t);
        }
    }
    return tags;
}
