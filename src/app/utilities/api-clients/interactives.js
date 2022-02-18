import http from "../http";

export default class interactives {
    static getAll() {
        // return http.get(`/zebedee/interactives`).then(response => {
            return [
                {
                    "id": 1,
                    "title": "Ante egestas ligula ultricies sed lacinia ipsum mauris tincidunt egestas.",
                    "userId": 1,
                    "content": "Elit vehicula adipiscing ut dolor quam amet augue mattis congue a tincidunt praesent lorem egestas viverra ut congue lectus sed ante lorem donec mattis nec donec mollis vitae lectus consectetur porta ante enim consectetur congue tortor sit ut amet ipsum adipiscing consectetur sed eget adipiscing libero a consectetur augue donec.",
                    "likes": 2,
                    "hits": 345,
                    "categoryId": 4,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 2,
                    "title": "Consectetur lacinia nam maecenas quam et amet lorem.",
                    "userId": 2,
                    "content": "Lorem adipiscing ipsum a mollis hendrerit a lorem ut sed viverra tincidunt viverra amet eget ut augue ut lorem dolor ipsum a tincidunt tortor et libero ut nam elit et donec adipiscing nam donec ipsum ut amet lacinia amet vitae non congue donec libero ac lacinia sit donec ipsum ante.",
                    "likes": 21,
                    "hits": 240,
                    "categoryId": 2,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 3,
                    "title": "Ipsum non hendrerit lectus libero sit donec vehicula viverra consectetur.",
                    "userId": 2,
                    "content": "Diam libero porta dolor consectetur amet libero sed viverra eget non ut maecenas mattis ut ligula adipiscing mattis hendrerit ipsum nec consectetur non lectus diam mauris sed libero donec lorem donec lorem diam mauris amet vehicula augue congue diam tortor donec congue eget et hendrerit consectetur libero maecenas consectetur congue.",
                    "likes": 21,
                    "hits": 45,
                    "categoryId": 3,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 4,
                    "title": "Vehicula enim ipsum et ipsum sit lorem donec mattis ut.",
                    "userId": 3,
                    "content": "Nam lorem eget a amet sit nam eget non vitae arcu lorem hendrerit libero mattis praesent ligula a tortor quam consectetur amet ut tincidunt vehicula sed et mattis libero quam libero quam lacinia nam a lorem tortor enim non libero sit ante donec non vehicula mollis elit tortor vitae ut.",
                    "likes": 23,
                    "hits": 62,
                    "categoryId": 3,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 5,
                    "title": "Quam lorem dolor vehicula ipsum ultricies vehicula sit lacinia.",
                    "userId": 4,
                    "content": "Sit non hendrerit congue augue viverra ante consectetur lorem elit mauris egestas a congue donec sit amet adipiscing non consectetur augue egestas sed ante augue ac nec amet enim consectetur enim amet diam congue nec dolor amet diam viverra ipsum praesent dolor elit diam enim sit enim donec amet libero.",
                    "likes": 12,
                    "hits": 89,
                    "categoryId": 4,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 6,
                    "title": "Tortor ut et mollis sed lacinia sed a donec.",
                    "userId": 5,
                    "content": "Amet mauris lorem arcu maecenas sit vehicula arcu lorem ante diam libero ligula praesent libero ut mattis congue ut ultricies praesent amet elit ac sit augue nec donec ac amet arcu lorem lacinia donec hendrerit elit lectus tortor sit consectetur ut adipiscing a tortor enim nec nam ac ligula ut.",
                    "likes": 10,
                    "hits": 34,
                    "categoryId": 5,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 7,
                    "title": "Enim dolor viverra ipsum sed lectus consectetur ligula diam.",
                    "userId": 2,
                    "content": "Praesent nec vehicula et lorem egestas libero mattis sed congue a libero dolor ligula ut donec a amet mattis donec augue maecenas diam lacinia donec ante tortor congue ac elit lectus diam egestas ipsum nam eget amet consectetur libero non ante congue sit hendrerit et libero viverra nam ipsum hendrerit.",
                    "likes": 12,
                    "hits": 56,
                    "categoryId": 1,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 8,
                    "title": "Maecenas a adipiscing praesent lorem mollis donec diam vehicula.",
                    "userId": 2,
                    "content": "Donec praesent ut congue amet lacinia consectetur ultricies lorem ultricies consectetur et diam et nec lectus quam congue libero donec non sit ut egestas eget nam eget lorem vitae amet lacinia mattis dolor congue sit mollis sit eget tincidunt viverra praesent ac hendrerit consectetur enim sit porta ultricies ipsum lacinia.",
                    "likes": 13,
                    "hits": 56,
                    "categoryId": 1,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 9,
                    "title": "Consectetur ligula lorem a consectetur ut hendrerit adipiscing lorem.",
                    "userId": 3,
                    "content": "Libero tincidunt augue sed a ultricies lectus diam lorem ante elit augue lorem congue ipsum tincidunt amet adipiscing vehicula sit nec augue consectetur egestas donec dolor porta et adipiscing arcu augue lorem ipsum non adipiscing augue lorem enim amet egestas hendrerit consectetur tincidunt viverra sed maecenas ultricies sit ipsum amet.",
                    "likes": 14,
                    "hits": 32,
                    "categoryId": 3,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }, {
                    "id": 10,
                    "title": "Quam lorem donec dolor mauris a lorem donec amet non.",
                    "userId": 5,
                    "content": "A non hendrerit diam lectus consectetur lacinia vitae elit hendrerit sed augue ac ut egestas praesent ipsum ligula sed tortor mattis non vehicula diam amet lorem viverra amet ipsum donec consectetur diam donec ut et donec viverra egestas a arcu amet sit libero amet congue non eget arcu ac nam.",
                    "likes": 19,
                    "hits": 97,
                    "categoryId": 4,
                    "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
                }
            ];
        // });
    }

    static create = interactiveId => {
        // return http.post(`/zebedee/interactives/${interactiveId}`, body).then(response => {
            return {
                "id": 1,
                "title": "Ante egestas ligula ultricies sed lacinia ipsum mauris tincidunt egestas.",
                "userId": 1,
                "content": "Elit vehicula adipiscing ut dolor quam amet augue mattis congue a tincidunt praesent lorem egestas viverra ut congue lectus sed ante lorem donec mattis nec donec mollis vitae lectus consectetur porta ante enim consectetur congue tortor sit ut amet ipsum adipiscing consectetur sed eget adipiscing libero a consectetur augue donec.",
                "likes": 2,
                "hits": 345,
                "categoryId": 4,
                "imageUrl": "https://i.picsum.photos/id/348/600/300.jpg"
            };
        // });
    };

    static remove(interactiveId) {
        // return http.delete(`/zebedee/interactives/${interactiveId}`).then(response => {
            return {
                "success": true
            };
        // });
    }
}
