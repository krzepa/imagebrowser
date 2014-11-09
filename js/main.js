window.addEventListener('DOMContentLoaded', function(evt){

    var ACCEPTED_TYPES = ['image/png','image/jpeg'],
        THUMB_WIDTH = 150,
        THUMB_HEIGHT = 150,
        fileBrowserBtn = document.querySelector('#file-browser'),
        fileListCon = document.querySelector('#file-list'),
        dropArea = document.querySelector('#drop-area');

    fileBrowserBtn.setAttribute('accept',ACCEPTED_TYPES.join(','));
    fileBrowserBtn.addEventListener('change',function(evt){
        var files = this.files;
        listFiles(filterFiles(files));
        this.value='';
    });

    dropArea.addEventListener('dragleave', function(evt){
        evt.preventDefault();
        this.classList.remove('over');
    });
    dropArea.addEventListener('dragover', function(evt){
        evt.preventDefault();
        this.classList.add('over');
    });
    dropArea.addEventListener('drop', function(evt){
        evt.preventDefault();
        this.classList.remove('over');
        var files = evt.dataTransfer.files;
        listFiles(filterFiles(files));
    });

    function listFiles(imageFiles) {
        while(fileListCon.firstChild) {
            fileListCon.removeChild(fileListCon.firstChild);
        };
        var frag = document.createDocumentFragment();
        imageFiles.forEach(function(el,i){
            var fr = new FileReader(),
                li = document.createElement('li'),
                img = document.createElement('img');

            img.setAttribute('width',THUMB_WIDTH);
            img.setAttribute('height',THUMB_HEIGHT);
            img.setAttribute('title',el.name);
            img.addEventListener('click',function(evt){
                window.open(this.getAttribute('src'),'_blank');
            });
            li.appendChild(img);
            frag.appendChild(li);
            fr.addEventListener('loadend',function(evt){
                img.setAttribute('src',fr.result);
            });
            fr.readAsDataURL(el);
        });
        fileListCon.appendChild(frag);
    }

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