var mongoose   = require('mongoose');
var Campground = require('./models/campground');
var Comment    = require('./models/comment');

var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=900&q=60",
        desc: "Si aliqua doctrina despicationes, nisi quamquam aut domesticarum, ubi quorum fabulas voluptate qui legam commodo est aute elit. Singulis arbitrantur qui vidisse, deserunt hic minim, voluptate do magna, veniam relinqueret commodo illum possumus, constias enim nulla e enim aut fugiat ullamco mentitum qui si minim reprehenderit, cillum possumus iis anim quem. Cupidatat e tempor eu doctrina quo quem mentitum."
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d95171e276fbd03de651f9aecb64b53d&auto=format&fit=crop&w=900&q=60",
        desc: "Tamen ne senserit ex malis exercitation litteris ipsum pariatur ab esse quamquam admodum te eram doctrina singulis, nescius aliqua quibusdam, iis sint ipsum e constias et summis exquisitaque expetendis illum quibusdam ab sunt iis possumus est culpa. Sunt voluptate non occaecat in minim ubi eiusmod ubi sunt. Ad quem ullamco possumus de quo possumus exercitation, vidisse et duis fabulas, est nescius o singulis, constias export offendit deserunt, export eiusmod singulis, litteris elit iis proident concursionibus de expetendis id nulla nescius."
    },
    {
        name: "Canyon Floor",
        image: "https://images.unsplash.com/photo-1499363145340-41a1b6ed3630?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b3761b04cf7c21b831647fbef86ad438&auto=format&fit=crop&w=900&q=60",
        desc: "Iis sed amet fore quid ne si eram probant voluptatibus aut et ullamco ad eiusmod nam quem do eu summis deserunt ne o litteris efflorescere iis ab ut relinqueret, se do relinqueret e senserit o labore. De esse cernantur incididunt est cernantur ne nescius, nisi incurreret despicationes, laborum an esse commodo, nam aute arbitrantur, elit si ita labore cernantur, dolor deserunt aut quae irure, quibusdam veniam anim ne export. Pariatur ab dolor an aute do ad irure singulis do a export admodum hic ut nulla singulis laborum, ingeniis labore labore quo irure a magna occaecat efflorescere, o amet incurreret expetendis, dolore non admodum."
    },
];

function seedDB() {
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } console.log("Campgrounds cleared.");

        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(data);
                } else {
                    console.log("Campground seeded.");

                    Comment.create(
                        {
                            text: "No internet here.",
                            author: "Homer"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Seeded comment.");
                            }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;
