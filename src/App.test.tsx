// @vitest-environment jsdom
import {afterEach,beforeEach,describe,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import App from './App';

describe('SHOPMINT Sidekick integration',()=>{
  beforeEach(()=>localStorage.clear());
  afterEach(()=>cleanup());

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

  it('keeps the complete listing editor reachable through its final instructions field',()=>{
    render(<App/>);
    fireEvent.click(screen.getByRole('button',{name:/start a product/i}));
    fireEvent.change(screen.getByLabelText(/product name/i),{target:{value:'Full Listing Test'}});
    fireEvent.click(screen.getByRole('button',{name:/create workspace/i}));
    fireEvent.click(screen.getByRole('button',{name:/listing builder/i}));
    expect(screen.getByLabelText(/customer instructions/i)).toBeTruthy();
    expect(screen.getByRole('button',{name:/copy all/i})).toBeTruthy();
  });
});
