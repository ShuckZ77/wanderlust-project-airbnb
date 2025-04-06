const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require("./review");

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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) await Review.deleteMany({ _id: { $in: listing.reviews } });   
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;