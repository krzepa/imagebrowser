/*
 * execute script when document is completely loaded and parsed
 * without waiting for loading styles and images
 */
window.addEventListener('DOMContentLoaded', function(evt){
    /*
     * local variables declaration
     */
    var ACCEPTED_TYPES = ['image/png','image/jpeg'],
        THUMB_WIDTH = 150,
        THUMB_HEIGHT = 150,
        fileBrowserBtn = document.querySelector('#file-browser'),
        fileListCon = document.querySelector('#file-list'),
        defaultInfo = document.querySelector('#file-list .info'),
        dropArea = document.querySelector('#drop-area'),
        fileReader, loadQueue;

    /*
     * restrict browsing files only to specified types
     * fix for firefox
     */
    if(navigator && /firefox/i.test(navigator.userAgent)) {
        fileBrowserBtn.setAttribute('accept','image/*');
    } else {
        fileBrowserBtn.setAttribute('accept',ACCEPTED_TYPES.join(','));
    }

    /*
     * get selected files and pass them to the listing function
     */
    fileBrowserBtn.addEventListener('change',function(evt){
        var files = this.files;
        listFiles(filterFiles(files));
        this.value='';
    });

    /*
     * drag & drop functionality
     */
    dropArea.addEventListener('dragleave', function(evt){
        evt.preventDefault();
        this.classList.remove('over');
    });
    dropArea.addEventListener('dragover', function(evt){
        evt.preventDefault();
        evt.dataTransfer.dropEffect='copy';
        this.classList.add('over');
    });
    dropArea.addEventListener('drop', function(evt){
        evt.preventDefault();
        this.classList.remove('over');
        var files = evt.dataTransfer.files;
        listFiles(filterFiles(files));
    });

    /*
     * main function which is responsible for generating list of clickable thumbs
     */
    function listFiles(imageFiles) {
        /*
         * stop previous loading operation
         */
        if(fileReader && fileReader.readyState!==FileReader.DONE) {
            fileReader.abort();
        }
        /*
         * remove all li elements if any
         */
        while(fileListCon.firstChild) {
            fileListCon.removeChild(fileListCon.firstChild);
        };
        /*
         * show default info if there is no images
         */
        if(!imageFiles.length) {
            fileListCon.appendChild(defaultInfo);
            return;
        }
        /*
         * for performance reasons append all newly created html elements
         * to DocumentFragment and then add this fragment to desired dom element
         */
        var frag = document.createDocumentFragment();

        /*
         * create list with image elements and corresponding loading queue
         */
        loadQueue = imageFiles.map(function(el,i){
            var li = document.createElement('li'),
            img = document.createElement('img');
            img.setAttribute('width',THUMB_WIDTH);
            img.setAttribute('height',THUMB_HEIGHT);
            img.setAttribute('title',el.name);
            img.setAttribute('alt',el.name);
            li.appendChild(img);
            frag.appendChild(li);
            return {img:img,file:el};
        });
        fileListCon.appendChild(frag);
        loadNextImage();
    }

    /*
     * load images sequentially
     */
    function loadNextImage() {
        var nextEl = loadQueue.shift();
        if(nextEl) {
            fileReader = new FileReader();
            fileReader.addEventListener('loadend', function(evt){
                nextEl.img.addEventListener('load',imageLoadedHandler);
                nextEl.img.setAttribute('src', this.result);
                this.removeEventListener('loadend',arguments.calee);
                loadNextImage();
            });
            fileReader.readAsDataURL(nextEl.file);
        }
    }

    /*
     * assign click handler to image when it is loaded
     */
    function imageLoadedHandler(evt) {
        this.addEventListener('click',function(evt){
            window.open(this.getAttribute('src'),'_blank');
        });
    }

    /*
     * convert array-like object to an array and filter out
     * all files which aren't images of specified types
     */
    function filterFiles(fileList) {
        var fileList = Array.prototype.slice.call(fileList);
        return fileList.filter(function(el,i){
            if(ACCEPTED_TYPES.indexOf(el.type)!==-1) {
                return true;
            } else {
                return false;
            }
        });
    }
});