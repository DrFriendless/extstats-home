export interface SubMenu extends MenuItem {
    style: string;
    items: MenuItem[];
}

export interface MenuItem {
    link: string;
    name: string;
}

export const bggMenu: SubMenu = { name: 'BGG', style: "nav-bgg", link: "", items: [
        { link: "https://boardgamegeek.com/guild/2938", name: "Guild" },
        { link: "https://www.boardgamegeek.com/microbadge/6964", name: "Microbadge" },
        { link: "https://www.boardgamegeek.com/microbadge/33991", name: "Friends" }
    ]};
export const devMenu: SubMenu = { name: 'Developer', style: 'nav-github', link: "", items: [
        { link: "https://github.com/DrFriendless/ExtendedStatsServerless", name: "GitHub"},
        { link: "https://github.com/DrFriendless/ExtendedStatsServerless/blob/master/misc/Dev%20Doco.pdf", name: "Dev Doc" },
        { link: "/admin.html", name: "Admin" }
    ]};
export const userMenu: SubMenu = { name: "Users", style: 'nav-dataprot', link: "/user.html", items: [
        { link: "/dataprotection.html", name: "Privacy" },
        { link: "/blog/passwords.html", name: "Advice on Passwords" },
    ]};

