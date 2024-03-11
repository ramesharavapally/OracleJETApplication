/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(["knockout", "ojs/ojarraydataprovider", "../ModelUtils/CustomerUtil", "ojs/ojlistdataproviderview", "ojs/ojdataprovider"
  , "ojs/ojtable", "ojs/ojinputtext"],
  function (ko, ArrayDataProvider, CustomerUtils, ListDataProviderView, ojdataprovider_1 ) {
    function CustomerViewModel(params) {            
      this.initObservables();
      this.initVariables();
      this.handleValueChanged = this._handleValueChanged.bind(this);
    };

    CustomerViewModel.prototype.initObservables = function () {
     
      this.filter = ko.observable();
      this.customerData = ko.observableArray([]);

    };

    CustomerViewModel.prototype.initVariables = function () {      
      this.customerDataProvider = ko.computed(() => {
        const filterRegEx = new RegExp(this.filter(), 'i');
        console.log(filterRegEx);
        const filterCriterion = {
          op: '$or',
          criteria: [{ op: '$regex', value: { customer_name: filterRegEx } },
                     { op: '$regex', value: { customer_address: filterRegEx } },
                     { op: '$regex', value: { customer_email: filterRegEx } },
                     { op: '$regex', value: { customer_website: filterRegEx } }
          ]
        };
        const arrayDataProvider = new ArrayDataProvider(this.customerData, { keyAttributes: 'id' });
        return new ListDataProviderView( arrayDataProvider, { filterCriterion: filterCriterion });
      });
      
      this.fetchAndInitializeData();
    };

    CustomerViewModel.prototype.fetchAndInitializeData = async function () {
      let custArray = await CustomerUtils.fetchCustomerData("jet_customers");
      console.log(custArray);
      this.customerData(custArray);
    };

    CustomerViewModel.prototype._handleValueChanged = function (event) {
      this.filter(document.getElementById('filter').rawValue);
    };




    return CustomerViewModel;
  }
);
