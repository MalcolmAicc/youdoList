
export default (items) => {

    var dragSrcEl = null;
    
    function handleDragStart(e) {
      console.log(e)
      this.style.opacity = '0.1';
      this.style.border = '3px dashed #c4cad3';
      dragSrcEl = this;
      
      console.log('dropStart',this)

      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('text/html', this.innerHTML);
    }
  
    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      
      e.dataTransfer.dropEffect = 'copy';
      
      return false;
    }
    
    function handleDragEnter(e) {
      // 添加移动进去的样式
      this.classList.add('task-hover');
    }
  
    function handleDragLeave(e) {
      // 移出样式
      this.classList.remove('task-hover');
    }
    
    // 拿到交换后的dom
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }

      console.log('drop',this);

      if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        console.log(e.dataTransfer.getData('text/html'))
      }
      
      return false;
    }
  
    function handleDragEnd(e) {
      this.style.opacity = '1';
      this.style.border = 0;
      
      items.forEach(function (item) {
        item.classList.remove('task-hover');
      });
    }
    
    // let items = document.querySelectorAll('.task'); 
    // console.log(items);
    items.forEach(function(item) {
      item.addEventListener('dragstart', handleDragStart, false);
      item.addEventListener('dragenter', handleDragEnter, false);
      item.addEventListener('dragover', handleDragOver, false);
      item.addEventListener('dragleave', handleDragLeave, false);
      item.addEventListener('drop', handleDrop, false);
      item.addEventListener('dragend', handleDragEnd, false);
    });
  }