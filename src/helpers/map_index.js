//ensuress latestMapIndex from "./mapdb"

import enmap from "enmap";
import fs from "fs";

//create /mapdb and handle error if it already exists
fs.mkdir(__dirname + '/mapdb', function (err) {if(err) console.log(err);});

//create/load persistant enmap in ./mapdb
const mapIndex = new enmap({name: "map-index", dataDir: __dirname + "/mapdb"});

//when db is ready
mapIndex.defer.then( () => {
//load the json file with the default index if the db is not up-to-date
//(when updating db push "mapindex.json" status as true)
let mapIndexStatus = fs.readFileSync(__dirname + '\\mapindexstatus.json', function (err) {console.log(err);});
let mapIndexStatusCur = JSON.parse(mapIndexStatus);
if (mapIndexStatusCur.updated == "true" || mapIndex.hasProp("map-index", "sectorindex").catch()) {

    mapIndex.delete("map-index");
    let mapIndexJSON = fs.readFileSync(__dirname + '\\mapindex.json', function (err) {console.log(err);});
    const defaultMapIndex = JSON.parse(mapIndexJSON);

//load values from mapindex.json into it
    mapIndex.ensure("map-index", defaultMapIndex);
    console.log(mapIndex.get("map-index"));

//update mapindexstatus.json to false
    let statusCur = JSON.stringify("false");
    fs.writeFileSync(__dirname + '\\mapindexstatus.json', statusCur);
};
});