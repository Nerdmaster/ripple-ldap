var libpath = process.env['PLUGIN_COV'] ? '../lib-cov' : '../lib';

var should = require("should")
  , sinon = require("sinon")
  , ldap = require('ldapjs')
  , auth = require(libpath + "/ldap-auth")._LDAPAuth

describe("LDAP Authentication", function() {
  var createClient, findLocalUser, importLocalUser;
  var fakeClient;
  var fakeUser;

  beforeEach(function() {
    // NEVER hit actual LDAP during unit tests!
    createClient = sinon.stub(ldap, "createClient");

    // To be sure we don't call createClient anywhere we shouldn't, we start off having it return
    // bogus data - if tests need ldap, they should overwrite this!
    fakeClient = {};
    createClient.returns(fakeClient);

    // NEVER hit the AM module functions (tests won't work if these methods aren't stubbed unless
    // one installs the entire Ripple app and runs tests inside it)!
    fakeUser = {
      name: 'Joebob Smith-Wesson',
      email: 'joebob@example.com',
      user: 'LDAP-joebob',
      pass: 'LDAP',
      external: true
    };
    findLocalUser = sinon.stub(auth, "findLocalUser");
    importLocalUser = sinon.stub(auth, "importLocalUser");
  });

  afterEach(function() {
    createClient.restore();
    findLocalUser.restore();
    importLocalUser.restore();
  });

  describe("#configMenu(menu)", function() {
    var menu;
    beforeEach(function() {
      menu = {};
      auth.configMenu(menu);
    });

    it("should add multiple inputs to the menu", function() {
      should.exist(menu.inputs);
      menu.inputs.length.should.be.above(1);
    });

    it("should set up key, label, value, and placeholder for all inputs", function() {
      for (var x = 0, l = menu.inputs.length; x < l; x++) {
        var input = menu.inputs[x];
        should.exist(input.key);
        should.exist(input.label);
        should.exist(input.value);
        should.exist(input.placeholder);
      }
    });
  });

  describe("#menuSave", function() {
    it("should call setConfig with data passed in", function() {
      var stub = sinon.stub(auth, "setConfig");
      auth.menuSave({foo: "bar"});
      stub.withArgs({foo: "bar"}).calledOnce.should.be.true;
      stub.restore();
    });
  });

  describe("#configLoaded(documents)", function() {
    it("should call setConfig with ldap-authentication's data", function() {
      var document = {name: "ldap-authentication", data: 3};
      var documents = [
        {name: "foo", data: 1},
        {name: "bar", data: 2},
        document,
        {name: "baz", data: 4},
      ];

      var stub = sinon.stub(auth, "setConfig");
      auth.configLoaded(documents);
      stub.calledOnce.should.be.true;
      stub.withArgs(document).calledOnce.should.be.true;
      stub.restore();
    });
  });

  describe("#presenterAuth(auth, cb", function() {
    // This is tricky due to the external dependency - is there a way to override a require()
    // statement?  If not, testing might require putting the AM require into a function we can
    // stub out.
    //
    // This method (and clientAuth) really should be broken into smaller chunks anyway, so testing
    // is simpler and code is cleaner.
    it("Needs in-depth testing");
  });

  describe("#clientAuth(auth, cb", function() {
    it("Needs in-depth testing");
  });

  describe("#clientUI(locals)", function() {
    it("should set auth to true on locals", function() {
      var locals = {};
      auth.clientUI(locals);
      locals.auth.should.be.true;
    });
  });

  describe("#validateConfiguration()", function() {
    it("Needs in-depth testing");
  });

  describe("#connect()", function() {
    it("Needs in-depth testing");
  });

  describe("#disconnect()", function() {
    it("Needs in-depth testing");
  });

  describe("#setConfig(data)", function() {
    it("Needs in-depth testing");
  });
});
