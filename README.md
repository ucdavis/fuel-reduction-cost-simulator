# Fuel Reduction Cost Simluator

FRCS was developed for the U.S. Forest Service and is a Microsoft Excel™ spreadsheet application used to estimate the costs of harvesting trees from stump to truck based on machine costs and production equations derived from existing studies ([Fight et al., 2006](https://www.fs.fed.us/pnw/pubs/pnw_gtr668.pdf)). The original FRCS model uses cost data that can be traced back to the year 2000. The cost data, including wages, equipment costs, and diesel fuel price, were updated to December 2007, and three new variants of FRCS, categorized by regions as west, north, and south, were developed with newly added production equations to estimate harvesting cost in the west, north, and south of the U.S., respectively ([Dykstra et al., 2009](https://www.fs.fed.us/pnw/pubs/journals/pnw_2009_dykstra001.pdf)). 

This research focuses on the state of California; hence the FRCS west variant is used, which is applicable to the following states: Alaska, Oregon, Washington, Arizona, California, Hawaii, Nevada, and New Mexico. The cost data for California in FRCS were updated and the model capability was enhanced through this work. Fuel consumption for harvesting trees is modeled based on the machine information and production rates embedded in FRCS. An allocation method was developed and implemented in the FRCS model to estimate the cost and fuel consumption associated with acquiring feedstock. New inputs were added to improve model flexibility, and new outputs were added to provide insights on yield, cost, and fuel consumption associated with feedstock. Additionally, the limits of the FRCS model on tree volumes were revised. The cost of harvesting large trees is modeled for volumes beyond the original limits. Furthermore, the adapted FRCS west variant was converted to JavaScript and published as a npm package ([@ucdavis/frcs](https://www.npmjs.com/package/@ucdavis/frcs)), and a user-friendly web application ([FRCS web app](https://frcs.ucdavis.edu)) was created for both stand-alone use and API integration.

## Installation

```bash
$ npm install @ucdavis/frcs
```

## Docs

[API Documentation](https://fuel-reduction-cost-simulator.azurewebsites.net/)

## License

[MIT](LICENSE)
