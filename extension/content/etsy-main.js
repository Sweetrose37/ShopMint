(()=>{
  if(globalThis.__shopmintEtsyReactBridge==='1.1.7')return;
  globalThis.__shopmintEtsyReactBridge='1.1.7';
  document.documentElement.setAttribute('data-shopmint-bridge-version','1.1.7');
  const applyValue=input=>{
    if(!(input instanceof HTMLInputElement))return;
    const token=input.getAttribute('data-shopmint-set-request');
    if(!token||input.getAttribute('data-shopmint-set-complete')===token)return;
    const value=input.getAttribute('data-shopmint-set-value')||'';
    const previousValue=input.value;
    input.focus();
    const ownSetter=Object.getOwnPropertyDescriptor(input,'value')?.set;
    const prototypeSetter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;
    (ownSetter&&ownSetter!==prototypeSetter?prototypeSetter:ownSetter||prototypeSetter)?.call(input,value);
    input._valueTracker?.setValue(previousValue);
    input.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:value}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
    input.setAttribute('data-shopmint-set-complete',token||'complete');
  };
  document.addEventListener('shopmint:set-react-value',event=>applyValue(event.target),true);
  new MutationObserver(records=>records.forEach(record=>applyValue(record.target))).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['data-shopmint-set-request']});
})();
