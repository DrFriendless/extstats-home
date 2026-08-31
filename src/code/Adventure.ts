import {getCollection} from "astro:content";

interface Milieu {
    tags?: string[];
    name: string;
    description: string;
    adventures: {}[];
    bindings: Record<string, string[]>;
}

interface Data {
    id: string;
    match: string;
    milieu: Milieu;
}

export class Adventure {
    url: string;
    title: string;
    tags: string[];
    milieu: Milieu;

    constructor(public id: string, data: Data) {
        this.milieu = data.milieu;
        this.url = `/adventures/${id}.html`;
        this.title = this.milieu.name || "None";
        this.tags = this.milieu.tags || [];
        if (this.tags.length === 0) this.tags.push("unspecified");
    }

    hasTag(tag: string | undefined) {
        if (!tag) return true;
        return this.tags.indexOf(tag) >= 0;
    }

    compareByTitle(other: Adventure): number {
        return cmp(this.title, other.title);
    }
}

function cmp(s1: string, s2: string) {
    if (s1 === s2) return 0;
    if (s1 < s2) return -1;
    return 1;
}

export async function allAdventures(): Promise<Adventure[]> {
    const advs = await getCollection('adventures');
    return advs.map(ce => new Adventure(ce.id, ce.data as unknown as Data));
}

export async function allAdventureTags(): Promise<string[]> {
    const tags = [ "unspecified", "meta" ];
    (await allAdventures()).forEach(adv => adv.tags.forEach(t => { if (tags.indexOf(t) < 0) tags.push(t); }));
    return tags;
}