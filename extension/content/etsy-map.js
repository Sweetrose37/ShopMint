globalThis.ShopmintSidekick=globalThis.ShopmintSidekick||{};
globalThis.ShopmintSidekick.etsy={
  listingUrlPatterns:[/etsy\.com\/your\/shops\/[^/]+\/(?:tools\/)?listings?\/(?:create|edit)/i,/etsy\.com\/your\/shops\/[^/]+\/listing-editor/i,/etsy\.com\/listing\/\d+\/edit/i],
  fields:{
    title:{labels:['Title Help','Title','Listing title'],selectors:['input[name="title"]','input[data-field="title"]','input[aria-label*="title" i]','textarea[name="title"]']},
    description:{labels:['Description','Listing description'],selectors:['textarea[name="description"]','textarea[data-field="description"]','textarea[aria-label*="description" i]']},
    price:{labels:['Price'],selectors:['input[name="price"]','input[inputmode="decimal"]','input[aria-label*="price" i]']},
    quantity:{labels:['Quantity'],selectors:['input[name="quantity"]','input[aria-label*="quantity" i]']},
    sku:{labels:['SKU','Stock keeping unit'],selectors:['input[name="sku"]','input[aria-label*="sku" i]'],revealLabels:['Add SKU']},
    materials:{labels:['Materials'],selectors:['input[name*="material" i]','input[aria-label*="material" i]']},
    primaryColor:{labels:['Primary color'],selectors:['input[name*="primary_color" i]','select[name*="primary_color" i]']},
    secondaryColor:{labels:['Secondary color'],selectors:['input[name*="secondary_color" i]','select[name*="secondary_color" i]']},
    occasion:{labels:['Occasion'],selectors:['input[name*="occasion" i]','select[name*="occasion" i]']},
    holiday:{labels:['Holiday'],selectors:['input[name*="holiday" i]','select[name*="holiday" i]']},
    personalization:{labels:['Personalization','Instructions for buyers'],selectors:['textarea[name*="personalization" i]','input[name*="personalization" i]']},
    whenMade:{labels:['When was it made?'],selectors:['select[name*="when" i]','select[aria-label*="When was it made" i]']}
  },
  tags:{inputSelectors:['input[name*="tag" i]','input[aria-label*="tag" i]','input[placeholder*="tag" i]','[data-selector="tags"] input'],containerSelectors:['[role="group"][aria-label="Tags"]','[role="group"][aria-labelledby*="tag" i]','[data-selector="tags"]','[data-field="tags"]','section[aria-label*="tag" i]']},
  creation:{
    whoMade:{question:'Who made it?',answers:{'i-did':'I did','shop-member':'A member of my shop','another-company-person':'Another company or person'}},
    whatIsIt:{question:'What is it?',answers:{'finished-product':'A finished product','supply-tool':'A supply or tool to make things'}},
    digitalCreation:{question:'How is this digital content created?',answers:{'created-by-me':'Created by me','ai-generator':'With an AI generator'}}
  }
};
