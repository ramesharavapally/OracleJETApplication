/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your Services ViewModel code goes here
 */
define(["knockout", "ojs/ojarraydataprovider", "text!../json_data/departmentData.json", "../ModelUtils/ServicesUtils", "ojs/ojtable", "ojs/ojpopup", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojmessages", "ojs/ojinputtext", "ojs/ojavatar"],
  function (ko, ArrayDataProvider, deptData, ServicesUtils) {

    function ServicesViewModel() {
      this.initObservables();
      this.initVariables();
      this.openDialogueListener = this._openDialogueListener.bind(this);
      this.saveAction = this._saveAction.bind(this);
      this.cancelAction = this._cancelAction.bind(this);
      this.ServiceselectedChangedListener = this._ServiceselectedChangedListener.bind(this);
      this.openUpdateDialogueListener = this._openUpdateDialogueListener.bind(this);
      this.updatesaveAction = this._updatesaveAction.bind(this);
      this.updatecancelAction = this._updatecancelAction.bind(this);
      this.openDeleteDialogueListener = this._openDeleteDialogueListener.bind(this);
      this.deletesaveAction = this._deletesaveAction.bind(this);
      this.deletecancelAction = this._deletecancelAction.bind(this);
    }

    ServicesViewModel.prototype.initObservables = function () {
      this.servicedata = ko.observableArray([]);
      this.messages = ko.observableArray([]);
      this.servicename = ko.observable();
      this.servicedesc = ko.observable();
      this.currentRow = ko.observable();
      this.currentserviceid = ko.observable();
      this.currentservicename = ko.observable();
      this.updateservicenameid = ko.observable();
      this.updateservicename = ko.observable();
      this.updateservicedesc = ko.observable();
    }

    ServicesViewModel.prototype.initVariables = function () {
      this.messagesDataprovider = new ArrayDataProvider(this.messages);
      this.dataprovider = new ArrayDataProvider(this.servicedata, { keyAttributes: 'id' });
      this.fetchAndInitializeServicesData();
    };

    ServicesViewModel.prototype.fetchAndInitializeServicesData = async function () {
      const servicesArray = await ServicesUtils.fetchServicesData('jet_services');
      this.servicedata(servicesArray);
    };

    ServicesViewModel.prototype._openDialogueListener = function (event) {
      // console.log(event)
      this.servicename('');
      this.servicedesc('');
      document.getElementById("modalDialog1").open();
    };


    ServicesViewModel.prototype._saveAction = async function (event) {      
      if (this.servicename() == '' || this.servicedesc() == '') {
        this.messages.push({
          severity: 'error',
          summary: 'Service creation error',
          detail: 'Service name or Service desc is not provided',
          autoTimeout: 4000
        });
        throw new Error(`Enter mandatory information`);
        
      }
      else {
        let serviceObject = {
          service_name: this.servicename(),
          service_description: this.servicedesc()
        };

        const reponse = await ServicesUtils.postData(serviceObject, "jet_services");

        this.fetchAndInitializeServicesData();
        document.getElementById("modalDialog1").close();

        this.messages.push({
          severity: 'confirmation',
          summary: 'Service created',
          detail: 'New service created successfully',
          autoTimeout: 4000
        });
      }      

    };

    ServicesViewModel.prototype._cancelAction = function (event) {
      document.getElementById("modalDialog1").close();
      // this.messages.push({
      //   severity: 'warning',
      //   summary: 'Service canceld',
      //   detail: 'New service creation request canceld',
      //   autoTimeout: 4000
      // });
    };

    ServicesViewModel.prototype._ServiceselectedChangedListener = function (event) {
      const row = event.detail.value.row;
      if (row.values().size > 0) {
        let rowkey = undefined;
        row.values().forEach((key) => {
          rowkey = key;
        });

        if (rowkey != undefined) {
          let filterRow = ko.utils.arrayFilter(this.servicedata(), (item) => {
            return item.id == rowkey;
          });

          this.currentRow(filterRow);
          this.currentserviceid(filterRow[0].id);
          this.updateservicenameid(filterRow[0].id);
          this.currentservicename(filterRow[0].service_name);
          this.updateservicename(filterRow[0].service_name);
          this.updateservicedesc(filterRow[0].service_description);

        }
      }
      else {
        throw new Error(`Unable to find key: ${row}`);
      }
    };

    ServicesViewModel.prototype._openUpdateDialogueListener = function (event) {
      document.getElementById("updateServiceDialogue").open();
    };

    ServicesViewModel.prototype._updatesaveAction = async function (event) {

      if (this.updateservicenameid() != undefined && this.updateservicenameid() != '') {

        const updateObj = {
          service_name: this.updateservicename(),
          service_description: this.updateservicedesc()

        }
        const updateResponseData = await ServicesUtils.updateServiceData(this.updateservicenameid(), updateObj, 'jet_services');
        this.fetchAndInitializeServicesData();
        this.messages.push({
          severity: 'confirmation',
          summary: `Service is updated`,
          detail: `Service ${this.updateservicename()} is updated`,
          autoTimeout: 4000
        });
      }

      document.getElementById("updateServiceDialogue").close();



    };

    ServicesViewModel.prototype._updatecancelAction = function (event) {

      this.messages.push({
        severity: 'warning',
        summary: `Service update cancelled`,
        detail: `Service ${this.updateservicename()} update is cancelled`,
        autoTimeout: 4000
      });
      document.getElementById("updateServiceDialogue").close();

    };

    ServicesViewModel.prototype._openDeleteDialogueListener = function (event) {
      document.getElementById("deleteServiceDialogue").open();
    };

    ServicesViewModel.prototype._deletesaveAction = async function () {
      const deleteresposnse = await ServicesUtils.deleteServiceData(this.currentserviceid(), "jet_services");
      if (deleteresposnse.status) {

        this.fetchAndInitializeServicesData();

        this.messages.push({
          severity: 'confirmation',
          summary: `Service deleted successfully`,
          detail: `Service ${this.currentservicename()} deleted successfully`,
          autoTimeout: 4000
        });
      }

      document.getElementById("deleteServiceDialogue").close();
    };
    ServicesViewModel.prototype._deletecancelAction = function () {



      this.messages.push({
        severity: 'warning',
        summary: `Service delete cancelled`,
        detail: `Service ${this.currentservicename()} delete cancelled`,
        autoTimeout: 4000
      });



      document.getElementById("deleteServiceDialogue").close();
    };

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return ServicesViewModel;
  }

);



