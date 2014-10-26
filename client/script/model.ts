/**
 * Created by krivopustov on 08.10.2014.
 */

/// <reference path="../lib/underscore/underscore.d.ts" />

module remote {

    export class Item {

        private path: string;
        private pathParts: Array<string>;
        private size: number;

        constructor(obj: { path: string; size: number }) {
            this.path = obj.path;
            this.pathParts = this.path.split("/");
            this.size = obj.size;
        }

        getPath(): string {
            return this.path;
        }

        getSize(): number {
            return this.size;
        }

        getName(): string {
            return _.last(this.pathParts);
        }

        getParent() : string {
            if (this.pathParts.length > 1) {
                return _.initial(this.pathParts).join("/");
            } else {
                return null;
            }
        }

        isDirectory(): boolean {
            return this.size == -1;
        }

        getPathParts(): Array<string> {
            return this.pathParts;
        }
    }
}
