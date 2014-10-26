/**
 * Created by krivopustov on 06.10.2014.
 */

/// <reference path="../lib/jquery/jquery.d.ts" />
/// <reference path="../lib/underscore/underscore.d.ts" />
/// <reference path="model.ts" />
/// <reference path="server.ts" />

module remote {

    export class MainView {

        private server: Server;

        constructor() {
            this.server = new Server();
        }

        render(parent: Item): void {
            var breadcrumbs;
            var tableBody = $(".table tbody");
            tableBody.empty();

            breadcrumbs = $("#breadcrumbs");
            breadcrumbs.empty();
            breadcrumbs.append(this.createBreadcrumbs(parent));

            breadcrumbs.off();
            breadcrumbs.on("click", "a", (event) => {
                event.preventDefault();
                var idx = $(event.target).data("id");
                console.log(idx);
                if (idx >= 0) {
                    var path = _.first(parent.getPathParts(), idx + 1).join("/");
                    this.render(new Item({path: path, size: -1}));
                } else {
                    this.render(null);
                }
            });

            this.server.load(parent == null ? null : parent.getPath(), (items: Array<Item>) => {
                for (var i = 0; i < items.length; i++) {
                    tableBody.append(this.createRow(i, items[i]));
                }

                $("a.name-link").on("click", (event) => {
                    event.preventDefault();
                    this.render(items[$(event.target).data("id")]);
                });

                $(".add").on("click", (event) => {
                    this.server.add(items[$(event.target).data("id")]);
                });
            });
        }

        private createBreadcrumbs(parent: Item): string {
            var res: string = "";
            if (parent != null) {
                var breadcrumbTemplate = $("#breadcrumb-template").html();
                res += _.template(breadcrumbTemplate, {id: -1, name: "Root"});
                for (var i = 0; i < parent.getPathParts().length; i++) {
                    var part = parent.getPathParts()[i];
                    if (i < parent.getPathParts().length - 1)
                        res += _.template(breadcrumbTemplate, {id: i, name: part});
                    else
                        res += _.template($("#breadcrumb-active-template").html(), {name: part});
                }
            } else {
                res += "Root";
            }
            return res;
        }

        private createRow(i: number, item: Item): string {
            var itemLink: string = item.isDirectory() ?
                _.template($("#item-link-template").html(), {itemId: i, itemName: item.getName()}) :
                item.getName();

            return _.template($("#item-template").html(),
                {itemId: i, itemLink: itemLink, itemSize: (item.isDirectory() ? "-" : item.getSize().toString())});
        }

    }
}

$(document).ready(() => {
    var mainView = new remote.MainView();
    mainView.render(null);
});