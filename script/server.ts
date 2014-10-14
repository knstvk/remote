/**
 * Created by krivopustov on 08.10.2014.
 */

/// <reference path="model.ts" />

module remote {

    export class Server {

        private testData = [
            {path: "Radiohead", size: -1},
            {path: "Radiohead/In Rainbows", size: -1},
            {path: "Radiohead/In Rainbows/CD1", size: -1},
            {path: "Radiohead/In Rainbows/CD2", size: -1},
            {path: "Radiohead/King Of Limbs", size: -1},
            {path: "Radiohead/In Rainbows/CD1/01 - 15 Step.mp3", size: 9529344},
            {path: "Radiohead/In Rainbows/CD1/02 - Bodysnatchers.mp3", size: 5222333},
            {path: "Radiohead/In Rainbows/CD1/03 - Nude.mp3", size: 4555666},
            {path: "Radiohead/In Rainbows/CD2/01 - MK1.mp3", size: 4555777},
            {path: "Radiohead/In Rainbows/CD2/02 - Down Is The New Up.mp3", size: 4545666},
            {path: "Radiohead/King Of Limbs/01 Bloom.MP3", size: 3444555},
            {path: "Radiohead/King Of Limbs/02 MorningMrMagpie.MP3", size: 4333555},
            {path: "Joe  Bonamassa", size: -1},
            {path: "Joe  Bonamassa/2011 - Dust Bowl", size: -1},
            {path: "Joe  Bonamassa/2012 - Driving Towards the Daylight", size: -1},
            {path: "Joe  Bonamassa/2011 - Dust Bowl/01 - Joe Bonamassa - Slow Train.mp3", size: 3444555},
            {path: "Joe  Bonamassa/2011 - Dust Bowl/02 - Joe Bonamassa - Dust Bowl.mp3", size: 4666777},
            {path: "Joe  Bonamassa/2012 - Driving Towards the Daylight/01 - Dislocated Boy.mp3", size: 5333555},
            {path: "Joe  Bonamassa/2012 - Driving Towards the Daylight/02 - Stones In My Passway.mp3", size: 4666888}
        ];


        load(parent: string): Array<Item> {
            var result: Array<Item> = [];
            for (var i = 0; i < this.testData.length; i++) {
                var obj = this.testData[i];
                var objParts = obj.path.split("/");
                if (parent == null) {
                    if (objParts.length == 1)
                        result.push(new Item(obj));
                } else {
                    var parentParts = parent.split("/");
                    if (objParts.length > 1 && _.isEqual(_.initial(objParts), parentParts)) {
                        result.push(new Item(obj));
                    }
                }
            }
            return result;
        }

        add(item: Item): void {
            console.log("Add " + item.getPath());
        }
    }
}