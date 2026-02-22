export class BlogPost {
    private pd: string | undefined;
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

    pubDate(): string {
        if (!this.pd) {
            const s = this.p.frontmatter.pubDate
            this.pd = s.slice(0, s.indexOf('T'));
        }
        return this.pd || "bob";
    }

    date() {
        const pd = this.pubDate();
        return new Date(pd);
    }

    correctUrl() {
        const s = this.url;
        return s + ".html";
    }

    hasTag(tag: string | undefined) {
        return ((tag !== "unspecified") && this.p.frontmatter.tags.indexOf(tag) >= 0) ||
            (((tag === "unspecified") || !tag) && !this.p.frontmatter.tags);
    }

    compareByPubDate(other: BlogPost): number {
        let c = -cmp(this.pubDate(), other.pubDate());
        if (c === 0) c = cmp(this.title, other.title);
        return c;
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
    return 1;
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

export function allBlogYears(): string[] {
    const posts = allBlogPosts();
    const result: string[] = [];
    for (const p of posts) {
        const y = p.pubDate().substring(0, 4);
        if (result.indexOf(y) < 0) result.push(y);
    }
    result.sort();
    return result;
}
