(()=>{
  if(globalThis.__shopmintEtsyReactBridge)return;
  globalThis.__shopmintEtsyReactBridge=true;
  document.addEventListener('shopmint:set-react-value',event=>{
    const input=event.target;
    if(!(input instanceof HTMLInputElement))return;
    const token=input.getAttribute('data-shopmint-set-request');
    const value=input.getAttribute('data-shopmint-set-value')||'';
    const ownSetter=Object.getOwnPropertyDescriptor(input,'value')?.set;
    const prototypeSetter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
    (ownSetter&&ownSetter!==prototypeSetter?prototypeSetter:ownSetter||prototypeSetter)?.call(input,value);
    input.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:value}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
    input.setAttribute('data-shopmint-set-complete',token||'complete');
  },true);
})();
