/* https://github.com/razvanh255 */

Module.register("imagers", {
    defaults: {
        updateInterval: 45000,
        imageFolder: "art",
        images: 9,
        marginTop: "10vh",
        width: "80%",
        opacity: 0.5,
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.images = [];
        this.currentImage = null;
        this.loadImages();
        this.scheduleUpdate();
    },

    getStyles: function () {
        return [];
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "imagers-container";
        wrapper.style.marginTop = this.config.marginTop;

        if (this.currentImage) {
            var img = document.createElement("img");
            img.src = this.currentImage;
            img.className = "imagers-image";
            img.style.width = this.config.width;
            img.style.opacity = this.config.opacity;
            wrapper.appendChild(img);
        } else {
            wrapper.innerHTML = "Loading images...";
       }

        return wrapper;
    },

    loadImages: function () {
        var self = this;
        for (var i = 1; i <= this.config.images; i++) {
            var imgPath = this.file(this.config.imageFolder) + "/Slide" + i + ".JPG"; //folder + "/Slide" + i + ".JPG";
            var img = new Image();
            img.src = imgPath;

            img.onload = function () {
                self.images.push(this.src);
                if (self.images.length === 1) {
                    self.updateImage();
                }
            };
        }
    },

    scheduleUpdate: function () {
        var self = this;
        setInterval(function () {
            self.updateImage();
        }, this.config.updateInterval);
    },

    updateImage: function () {
        if (this.images.length > 0) {
            var randomIndex = Math.floor(Math.random() * this.images.length);
            this.currentImage = this.images[randomIndex];
            this.updateDom(config.animation);
        }

/*        if (this.currentImage) {
            var below = document.querySelector('.below');
            if (!below) return;
            
            below.style.backgroundImage = "url(" + this.currentImage + ")";
            below.style.backgroundSize = "28%";
            below.style.backgroundPosition = "center 50%";
            below.style.backgroundRepeat = "no-repeat";
            below.style.transition = "all 2s ease-in-out";
            below.style.boxShadow = "inset 0 0 10px #311b0b";
        }
*/
    },
});
