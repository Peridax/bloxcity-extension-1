function Core() {
    this.interval = 5000;           // How many ms to wait before calling core.crawl
    this.intervalWrapper = null;    // Unused variables
    this.init = {}                  // Unused object
    this.curr = {}                  // Unused object

    this.start = (obj) => {
        console.log('Notifier has started');
        obj.intervalWrapper = setInterval(() => obj.crawl(obj), obj.interval);
    };

    this.crawl = (obj) => {
        $.get('https://www.bloxcity.com/store/fetch/recent/1/').then((data) => {
            let $first = $('.store-item-card', data).eq(0);

            if (!obj.init.id) {
                obj.init.id = parseInt($first.find('a').eq(0).attr('href').replace(/\D/g, ''));
            } else {
                obj.curr.price = parseInt($first.find('.item-price').text().replace(/\D/g, ''));
                obj.curr.id = parseInt($first.find('a').eq(0).attr('href').replace(/\D/g, ''));
                obj.curr.name = $first.find('.item-name').text().trim();
                obj.curr.img = $first.find('img').eq(0).attr('src');

                if (obj.curr.id !== obj.init.id) {
                    obj.curr.id > obj.init.id ? obj.curr.state = 1 : obj.curr.state = 2;
                    obj.notify(obj.curr);
                };
            };
        });
    };

    this.notify = (obj) => {
        chrome.notifications.create('item', {
            type: "list",
            title: (obj.state === 1 ? "New" : "Updated") + " Item",
            message: "",
            iconUrl: obj.img,
            items: [{
                title: obj.name,
                message: ""
            }, {
                title: "Price",
                message: obj.price.toString()
            }]
        });
    };
};

const core = new Core;
core.start(core);
