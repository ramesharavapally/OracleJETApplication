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
    function LoginViewModel() {
      this.initObservables();
      this.initVariables();
    }
    



    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return LoginViewModel;
  }
);
