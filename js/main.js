window.addEventListener('DOMContentLoaded', function(evt){

    var ACCEPTED_TYPES = ['image/png','image/jpeg'];
    var THUMB_WIDTH = 150;
    var THUMB_HEIGHT = 150;

    var fileBrowserBtn = document.querySelector('#file-browser');
    fileBrowserBtn.setAttribute('accept',ACCEPTED_TYPES.join(','));
    fileBrowserBtn.addEventListener('change',function(evt){
        var files = this.files;
        listFiles(filterFiles(files));
        this.value='';
    });

    var fileListCon = document.querySelector('#file-list');
    var dropArea = document.querySelector('#drop-area');
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
        imageFiles.forEach(function(el,i){
            var fr = new FileReader();
            fr.addEventListener('loadend',function(evt){
                var li = document.createElement('li');
                var img = document.createElement('img');
                img.setAttribute('width',THUMB_WIDTH);
                img.setAttribute('height',THUMB_HEIGHT);
                img.setAttribute('src',fr.result);
                img.setAttribute('title',el.name);
                img.addEventListener('click',function(evt){
                    window.open(this.getAttribute('src'),'_blank');
                });
                li.appendChild(img);
                fileListCon.appendChild(li);
            });
            fr.readAsDataURL(el);
        });
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