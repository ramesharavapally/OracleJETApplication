/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your User ViewModel code goes here
 */
define(["knockout", "../ModelUtils/UserUtils", "ojs/ojarraydataprovider", "ojs/ojtable", "ojs/ojdialog", "ojs/ojbutton", "ojs/ojformlayout", "ojs/ojinputtext", "ojs/ojselectcombobox",
  "ojs/ojcheckboxset", "ojs/ojmessages"],
  function (ko, UserUtils, ArrayDataProvider) {
    function UserViewModel() {
      this.initObservables();
      this.initVariables();
      this.UserselectedChangedListener = this._UserselectedChangedListener.bind(this);
      this.openUpdateDialogueListener = this._openUpdateDialogueListener.bind(this);
      this.openDeleteDialogueListener = this._openDeleteDialogueListener.bind(this);
      this.CreateUserSaveAction = this._CreateUserSaveAction.bind(this);
      this.CreateUserCancelAction = this._CreateUserCancelAction.bind(this);
      this.openDialogueListener = this._openDialogueListener.bind(this);
    }

    UserViewModel.prototype.initObservables = function () {
      this.userdata = ko.observableArray([]);
      this.currentRow = ko.observable();
      this.currentUserId = ko.observable();
      this.currentUserName = ko.observable();
      this.currentUserDesc = ko.observable();
      this.userName = ko.observable();
      this.userpasssword = ko.observable();
      this.userType = ko.observable();
      this.userTypeLov = ko.observableArray([]);
      this.displayName = ko.observable();
      this.active = ko.observable();
      this.messageArray = ko.observableArray([]);
      
      
      
      
    };

    UserViewModel.prototype.initVariables = function () {
      this.userTypeLov = [
        { value: "USER", label: "User" },
        { value: "ADMIN", label: "Admin" }
      ];
      this.userDataProvider = new ArrayDataProvider(this.userdata, { keyAttributes: 'id' });
      this.userTypeDataProvider = new ArrayDataProvider(this.userTypeLov, { keyAttribute: 'value' });
      this.messagesDataprovider = new ArrayDataProvider(this.messageArray);      
      this.fetchUserData();
    };

    UserViewModel.prototype.fetchUserData = async function () {
      const userArray = await UserUtils.fetchUserData('jet_users');
      this.userdata(userArray);
    };

    UserViewModel.prototype._UserselectedChangedListener = function (event) {
      const row = event.detail.value.row;
      if (row.values().size > 0) {
        let rowkey = undefined;
        row.values().forEach((key) => {
          rowkey = key;
        });
        if (rowkey != undefined) {
          let filterRow = ko.utils.arrayFilter(this.userdata(), (item) => {
            return item.id == rowkey;
          });
          this.currentRow(filterRow);
          this.currentUserName(filterRow[0].user_name);
          console.log( this.currentUserName());
        }
        


      }
    };

    UserViewModel.prototype._openUpdateDialogueListener = function (event) {
      document.getElementById("createuser-dialog").open();

    };

    UserViewModel.prototype._openDeleteDialogueListener = function (event) {
      document.getElementById("createuser-dialog").open();

    };

    UserViewModel.prototype._CreateUserSaveAction = function (event) {
      

      if (this.userName() == null || this.userpasssword() == null || this.displayName() == null || this.userType() == null) {
        this.messageArray.push({
          severity: 'error',
          summary: 'User creation error',
          detail: 'Please enter mandatory information.',
          autoTimeout: 4000
        });
        throw new Error(`Enter mandatory information`);
      }
      else {
        console.log(this.active());
        const userObject = {
          user_name: this.userName(),
          user_password: this.userpasssword(),
          user_display_name: this.displayName(),
          user_active: this.active() == null ? "N" : this.active()[0],
          user_type: this.userType()
        };

        const response = UserUtils.postData(userObject, "jet_users");

        console.log(response);


        this.messageArray.push({
          severity: 'confirmation',
          summary: 'User Created',
          detail: 'New User created successfully.',
          autoTimeout: 4000
        });

      }

      document.getElementById("createuser-dialog").close();
      this.fetchUserData();

    };

    UserViewModel.prototype._CreateUserCancelAction = function (event) {
      
      document.getElementById("createuser-dialog").close();
    };

    UserViewModel.prototype._openDialogueListener = function (event) {

      this.userName(null);
      this.userpasssword(null);
      this.displayName(null);
      this.active(null);
      this.userType(null);

      document.getElementById("createuser-dialog").open();

    };


    return UserViewModel;
  }
);
