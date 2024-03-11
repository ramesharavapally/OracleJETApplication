/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */


/*
 * Your Scheduler ViewModel code goes here
 */
define(["knockout", "../ModelUtils/SchedulerUtil", "ojs/ojarraydataprovider",
  "ojs/ojconverterutils-i18n", "ojs/ojselectcombobox", "ojs/ojdatetimepicker",
  "ojs/ojlabel", "ojs/ojpopup", "ojs/ojbutton", "ojs/ojdialog", "ojs/ojmessages",
  "ojs/ojinputtext", "ojs/ojavatar", "ojs/ojtable"],
  function (ko, SchedulerUtil, ArrayDataProvider, ojconverterutils_i18n_1) {
    function SchedulerViewModel() {
      this.initObservables();
      this.initVariables();
    }
    SchedulerViewModel.prototype.initObservables = function () {
      this.statusType = ko.observable();
      this.customer = ko.observable();
      this.servicename = ko.observable();
      this.customerArray = ko.observableArray([]);
      this.statusArray = ko.observableArray([]);
      this.ServiceArray = ko.observableArray([]);
      this.scheduleArray = ko.observableArray([]);
      this.userArray = ko.observableArray([]);
      this.currentRow = ko.observable();
      this.updateScheduleTitle = ko.observable();
      this.fromDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date()));
      this.toDate = ko.observable(ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(new Date().setMonth(new Date().getMonth() + 12))));
      this.messages = ko.observableArray([]);
      /**For update Popup attributes*/
      this.currentScheduleId = ko.observable();
      this.currentCustomerName = ko.observable();
      this.currentServiceName = ko.observable();
      this.currentScheduelStatus = ko.observable();
      this.currentScheduleAddedBy = ko.observable();
      /**End of update Popup attributes */
      /**
       * Craete Popup attributes
       */
      this.createSCustomerName = ko.observable();
      this.createServiceName = ko.observable();
      this.createScheduelStatus = ko.observable();
      this.createScheduleAddedBy = ko.observable();
      this.createScheuleDate = ko.observable();
      this.scheduleMinDate = ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date());
      this.scheduleMaxDate = ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date(new Date().setDate(new Date().getDate() + 10)));
      this.createScheduleDec = ko.observable();

      /**End of Create popup attributes */
      this.refreshListener = this._refreshListener.bind(this);
      this.UserselectedChangedListener = this._UserselectedChangedListener.bind(this);
      this.openUpdateDialogueListener = this._openUpdateDialogueListener.bind(this);
      this.openCancelDialogueListener = this._openCancelDialogueListener.bind(this);
      this.openCloseDialogueListener = this._openCloseDialogueListener.bind(this);
      this.addScheduleListener = this._addScheduleListener.bind(this);
      /**
       * Popup actions
       */
      this.updatesaveAction = this._updatesaveAction.bind(this);
      this.updatecancelAction = this._updatecancelAction.bind(this);
      this.deletesaveAction = this._deletesaveAction.bind(this);
      this.deletecancelAction = this._deletecancelAction.bind(this);
      this.createsaveAction = this._createsaveAction.bind(this);
      this.createcancelAction = this._createcancelAction.bind(this);
      this.closesaveAction = this._closesaveAction.bind(this);
      this.closecancelAction = this._closecancelAction.bind(this);




    }
    SchedulerViewModel.prototype.initVariables = function () {
      this.statusArray = [
        { value: "ALL", label: "All" },
        { value: "ACTIVE", label: "Active" },
        { value: "CLOSED", label: "Closed" },
        { value: "CANCELLED", label: "Cancelled" }
      ];
      this.statusDataProvider = new ArrayDataProvider(this.statusArray, { keyAttributes: 'value' });
      this.customerDataProvider = new ArrayDataProvider(this.customerArray, { keyAttributes: 'value' });
      this.ServiceDataProvider = new ArrayDataProvider(this.ServiceArray, { keyAttributes: 'value' });
      this.scheduleDataProvider = new ArrayDataProvider(this.scheduleArray, { keyAttributes: 'id' });
      this.userDataProvider = new ArrayDataProvider(this.userArray, { keyAttributes: 'value' });
      this.messagesDataprovider = new ArrayDataProvider(this.messages);
      this.fetchAndInitializeServiceData();
      this.fetchAndInitializeCustomerData();
      this.fetchAndInitializeUserData();

    }

    SchedulerViewModel.prototype.fetchAndInitializeServiceData = async function () {
      const serviceData = await SchedulerUtil.fetchData('jet_services');
      const serviceNames = serviceData.map(item => ({
        value: item.service_name,
        label: item.service_name
      }));
      this.ServiceArray(serviceNames);
    }

    SchedulerViewModel.prototype.fetchAndInitializeCustomerData = async function () {
      const cusData = await SchedulerUtil.fetchData('jet_customers');
      const custNames = cusData.map(item => ({
        value: item.customer_name,
        label: item.customer_name
      }));
      this.customerArray(custNames);
    }

    SchedulerViewModel.prototype.fetchAndInitializeUserData = async function () {
      const usrData = await SchedulerUtil.fetchData('jet_users');
      // const usrNames = usrData.map(item => ({
      //   value: item.user_type,
      //   label: item.user_type
      // }));
      // Extract distinct user types using a Set
      const uniqueUserTypesSet = new Set(usrData.map(item => item.user_type));
      // Convert the Set back to an array of objects with 'value' and 'label' properties
      const distinctUserTypes = Array.from(uniqueUserTypesSet).map(userType => ({
        value: userType,
        label: userType
      }));

      // Set the distinct user types to the 'userArray' observable
      this.userArray(distinctUserTypes);

    }

    SchedulerViewModel.prototype._refreshListener = async function (event) {
      const searchObj = {
        statustype: this.statusType(),
        customername: this.customer(),
        servicename: this.servicename(),
        fromdate: this.fromDate(),
        todate: this.toDate()
      };
      console.log(searchObj);
      await this.fetchSchedulerData();

      /** Filter logic */
      const filteredData = ko.utils.arrayFilter(this.scheduleArray(), function (item) {
        const itemDate = new Date(item.schedule_date);
        const rangeStartDate = new Date(searchObj.fromdate);
        const rangeEndDate = new Date(searchObj.todate);

        return (
          itemDate >= rangeStartDate &&
          itemDate <= rangeEndDate &&
          (searchObj.statustype === 'ALL' || searchObj.statustype === undefined || item.schedule_status === searchObj.statustype) &&
          (searchObj.customername === undefined || item.schedule_customer_fk === searchObj.customername) &&
          (searchObj.servicename === undefined || item.schedule_service_fk === searchObj.servicename)

        );
      });

      // Assuming you want to update another Knockout observableArray with the filtered data      
      this.scheduleArray(filteredData);
      console.log(filteredData);

    }

    SchedulerViewModel.prototype.fetchSchedulerData = async function () {
      const scheduleData = await SchedulerUtil.fetchData('jet_services_schedule');
      // console.log(scheduleData);
      this.scheduleArray(scheduleData);
    }

    SchedulerViewModel.prototype._UserselectedChangedListener = function (event) {
      const row = event.detail.value.row;
      console.log(row);
      if (row.values().size > 0) {
        let rowkey = undefined;
        row.values().forEach((key) => {
          rowkey = key;
        });

        if (rowkey != undefined) {
          let filterRow = ko.utils.arrayFilter(this.scheduleArray(), (item) => {
            return item.id == rowkey;
          });

          this.currentRow(filterRow);
          this.currentScheduleId(this.currentRow()[0].id);
          this.currentCustomerName(this.currentRow()[0].schedule_customer_fk);
          this.currentServiceName(filterRow[0].schedule_service_fk);
          this.currentScheduelStatus(filterRow[0].schedule_status);
          this.currentScheduleAddedBy(filterRow[0].schedule_added_by);
          this.updateScheduleTitle(`Update Schedule ${this.currentScheduleId()}`);


        }
      }
      else {
        throw new Error(`Unable to find key: ${row}`);
      }
      console.log("Current row is");
      console.log(this.currentRow());

    }

    SchedulerViewModel.prototype._openUpdateDialogueListener = function (event) {
      document.getElementById("updateScheduleDialogue").open();


    }
    SchedulerViewModel.prototype._openCancelDialogueListener = function (event) {
      document.getElementById("deleteScheduleDialogue").open();
    }

    SchedulerViewModel.prototype._openCloseDialogueListener = function (event) {
      document.getElementById("closeScheduleDialogue").open();

    }

    SchedulerViewModel.prototype._updatesaveAction = async function (event) {

      const scheduleObj = {
        schedule_customer_fk: this.currentCustomerName(),
        schedule_service_fk: this.currentServiceName(),
        schedule_status: this.currentScheduelStatus(),
        schedule_added_by: this.currentScheduleAddedBy(),
        schedule_date: this.currentRow()[0].schedule_date,
        schedule_description: this.currentRow()[0].schedule_description

      }

      const updateResponseData = await SchedulerUtil.updateSchedulerData(this.currentScheduleId(), scheduleObj, 'jet_services_schedule');
      await this.fetchSchedulerData();


      document.getElementById("updateScheduleDialogue").close();

      this.messages.push({
        severity: 'confirmation',
        summary: 'Schedule updated',
        detail: `Schedule ${this.currentScheduleId()} is updated`,
        autoTimeout: 4000
      });

    }
    SchedulerViewModel.prototype._updatecancelAction = function (event) {
      document.getElementById("updateScheduleDialogue").close();
    }

    SchedulerViewModel.prototype._deletesaveAction = async function (event) {
      const deleteresposnse = await SchedulerUtil.deleteSchedulerData(this.currentScheduleId(), "jet_services_schedule");
      if (deleteresposnse.status) {

        this.fetchSchedulerData();

        this.messages.push({
          severity: 'confirmation',
          summary: `Schedule deleted successfully`,
          detail: `Schedule ${this.currentScheduleId()} ${this.currentScheduelStatus()} deleted successfully`,
          autoTimeout: 4000
        });
      }

      document.getElementById("deleteScheduleDialogue").close();
    };

    SchedulerViewModel.prototype._deletecancelAction = function (event) {
      document.getElementById("deleteScheduleDialogue").close();
    };

    SchedulerViewModel.prototype._addScheduleListener = function (event) {
      this.createSCustomerName('');
      this.createServiceName('');
      this.createScheduelStatus("ACTIVE");
      this.createScheduleAddedBy('');
      this.createScheduleDec('');
      this.createScheuleDate('');
      document.getElementById("createScheduleDialogue").open();
    };

    SchedulerViewModel.prototype._createsaveAction = async function (event) {
      const createObj = {
        schedule_customer_fk: this.createSCustomerName(),
        schedule_service_fk: this.createServiceName(),
        schedule_status: this.createScheduelStatus(),
        schedule_added_by: this.createScheduleAddedBy(),
        schedule_date: this.createScheuleDate(),
        schedule_description: this.createScheduleDec()
      };

      const response = await SchedulerUtil.postData(createObj, "jet_services_schedule")


      await this.fetchSchedulerData();

      document.getElementById("createScheduleDialogue").close();

      this.messages.push({
        severity: 'confirmation',
        summary: 'Scheduler created',
        detail: 'New Scheduler created successfully',
        autoTimeout: 4000
      });

    };
    SchedulerViewModel.prototype._createcancelAction = function (event) {
      document.getElementById("createScheduleDialogue").close();
    };

    SchedulerViewModel.prototype._closesaveAction = async function (event) {
      const scheduleObj = {
        schedule_customer_fk: this.currentCustomerName(),
        schedule_service_fk: this.currentServiceName(),
        schedule_status: "CLOSED",
        schedule_added_by: this.currentScheduleAddedBy(),
        schedule_date: this.currentRow()[0].schedule_date,
        schedule_description: this.currentRow()[0].schedule_description

      };

      const updateResponseData = await SchedulerUtil.updateSchedulerData(this.currentScheduleId(), scheduleObj, 'jet_services_schedule');

      document.getElementById("closeScheduleDialogue").close();
      await this.fetchSchedulerData();

      this.messages.push({
        severity: 'confirmation',
        summary: 'Schedule updated',
        detail: `Schedule ${this.currentScheduleId()} is closed`,
        autoTimeout: 4000
      });
    };
    SchedulerViewModel.prototype._closecancelAction = function (event) {
      document.getElementById("closeScheduleDialogue").close();
    };




    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return SchedulerViewModel;
  }
);
