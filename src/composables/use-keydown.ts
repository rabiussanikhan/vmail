import { onBeforeUnmount } from 'vue'
  
let useKeydown = (keyCombos: any[]) => {
  let onKeydown = (event:any) => {
    let kc = keyCombos.find(kc => kc.key == event.key)
    if(kc) {
      kc.fn()
    }
  }

  window.addEventListener('keydown', onKeydown)
  onBeforeUnmount(()=>{
    window.removeEventListener('keydown', onKeydown)
  })
}

export default useKeydown;