import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log("Connection to MongoDB is OK")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const {data} = require("./data");

const listingSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "Description is missing"
    },
    image: {
        filename: {
            type: String,
            default: "imagefile",
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1732287931034-c4cc1b06de6a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1732287931034-c4cc1b06de6a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        }
    },
    price: {
        type: Number,
        default: 100
    },
    location: {
        type: String,
        default: "KANPUR"
    },
    country: {
        type: String,
        default: "INDIA"
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

const Listing = mongoose.model("Listing", listingSchema);

await Listing.deleteMany({});

// console.log(sampleListings)

for (let listing of data){
    listing.owner = "67ce64014e7e654baf75b335";
}

await Listing.insertMany(data)


