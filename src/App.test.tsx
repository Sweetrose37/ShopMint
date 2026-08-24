// @vitest-environment jsdom
import {beforeEach,describe,expect,it} from 'vitest';
import {fireEvent,render,screen} from '@testing-library/react';
import App from './App';

describe('SHOPMINT Sidekick integration',()=>{
  beforeEach(()=>localStorage.clear());

  it('creates a product and exposes a real readiness workflow',()=>{
    render(<App/>);
    fireEvent.click(screen.getByRole('button',{name:/start a product/i}));
    fireEvent.change(screen.getByLabelText(/product name/i),{target:{value:'Sidekick Test Product'}});
    fireEvent.change(screen.getByLabelText(/product type/i),{target:{value:'Digital paper'}});
    fireEvent.click(screen.getByRole('button',{name:/create workspace/i}));
    fireEvent.click(screen.getByRole('button',{name:/etsy sidekick/i}));
    expect(screen.getByText(/listing readiness/i)).toBeTruthy();
    expect((screen.getByRole('button',{name:/export for sidekick/i}) as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByText(/review-first by design/i)).toBeTruthy();
  });
});
