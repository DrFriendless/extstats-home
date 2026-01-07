export interface SubMenu extends MenuItem {
    style: string;
    items: MenuItem[];
}

export interface MenuItem {
    link: string;
    name: string;
}

export interface Link {
    style: string;
    link: string;
    name: string;
    items: Link[];
}

export const bggMenu: SubMenu = { name: 'BGG', style: "nav-bgg", link: "", items: [
        { link: "https://boardgamegeek.com/guild/2938", name: "Guild" },
        { link: "https://www.boardgamegeek.com/microbadge/6964", name: "Microbadge" },
        { link: "https://www.boardgamegeek.com/microbadge/33991", name: "Friends" }
    ]};
export const githubMenu: SubMenu = { name: 'Github', style: 'nav-github', link: "", items: [
        { link: "https://github.com/DrFriendless/ExtendedStatsServerless", name: "Server"},
        { link: "https://github.com/DrFriendless/ExtstatsClient", name: "Client"},
        { link: "https://github.com/DrFriendless/extstats-home", name: "Site"},
        { link: "https://github.com/DrFriendless/extstats-angular", name: "Angular lib"},
        { link: "https://github.com/DrFriendless/extstats-core", name: "Interfaces"},
        { link: "https://github.com/DrFriendless/extstats-datatable", name: "Table"},
        { link: "https://github.com/DrFriendless/favcombo", name: "Favourites combo"}
    ]};
export const devMenu: SubMenu = { name: 'Developer', style: 'nav-github', link: "", items: [
        { link: "/admin.html", name: "Admin" },
        githubMenu,
        // { link: "https://github.com/DrFriendless/ExtendedStatsServerless/blob/master/misc/Dev%20Doco.pdf", name: "Dev Doc" },
    ]};

export const userMenu: SubMenu = { name: "Users", style: 'nav-dataprot', link: "/user.html", items: [
        { link: "/dataprotection.html", name: "Privacy" },
        { link: "/blog/passwords.html", name: "Advice on Passwords" },
    ]};

