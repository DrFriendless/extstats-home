import { type Loader } from 'astro/loaders';
import { readFileSync, globSync } from 'node:fs';

function getId(str:string):string {
    const strParts = str.split('/');
    const fileName = strParts.at(-1);
    const [ id ] = fileName!.split('.');
    return id;
}

export function milieuLoader(source: string | readonly string[]):Loader {
    return {
        name: 'milieu-loader',
        async load({ store }) {
            globSync(source).map(match => {
                const contents = readFileSync(match);
                const milieu = JSON.parse(contents.toString());
                const id = getId(match);
                const data = {
                    id,
                    match,
                    milieu
                };
                store.set({
                    id,
                    data
                })
            })
        }
    }
}