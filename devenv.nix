{ pkgs, lib, config, inputs, ... }:

let
  # Use Rosetta packages on Apple Silicon for compatibility
  rosettaPkgs =
    if pkgs.stdenv.isDarwin && pkgs.stdenv.isAarch64
    then pkgs.pkgsx86_64Darwin
    else pkgs;

  darwinPackages = with pkgs; [
    apple-sdk
  ];

  linuxPackages = with pkgs; [
    webkitgtk_4_1
  ];

  # PostgreSQL configuration
  postgresUser = "voltampere_user";
  postgresPassword = "voltampere_pass";
  postgresDb = "voltampere";
  postgresHost = "127.0.0.1";
  postgresPort = 5432;

  databaseUrl = "postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${toString postgresPort}/${postgresDb}";

in {
  packages = with pkgs; [
    git
    # NOTE: In case there's `Cannot find module: ... bcrypt ...` error, try `npm rebuild bcrypt`
    # See: https://github.com/kelektiv/node.bcrypt.js/issues/800
    # See: https://github.com/kelektiv/node.bcrypt.js/issues/1055
    nodejs_22
    nodePackages.typescript-language-server
    nodePackages.prisma
    prisma-engines
  ] ++ lib.optionals pkgs.stdenv.isDarwin darwinPackages
    ++ lib.optionals pkgs.stdenv.isLinux linuxPackages;

  env = {
    DATABASE_URL = databaseUrl;
  } // lib.optionalAttrs pkgs.stdenv.isLinux {
    # NOTE: Setting these `PRISMA_*` environment variables fixes
    # "Error: Failed to fetch sha256 checksum" - 404 errors
    # See: https://github.com/prisma/prisma/discussions/3120
    PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
    PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
    PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
  };

  scripts = {
    hello.exec = "echo Development environment ready!";
  };

  enterShell = ''
    git --version
    node --version
    echo "EV Charging Simulator - Development environment ready!"
    export DATABASE_URL=${databaseUrl}
  '';

  dotenv.enable = true;

  languages = {
    typescript.enable = true;
    javascript = {
      enable = true;
      npm.enable = true;
      pnpm.enable = true;
    };
  };

  services.postgres = {
    enable = true;
    package = pkgs.postgresql_17;
    listen_addresses = postgresHost;
    port = postgresPort;
    initialScript = ''
      CREATE USER ${postgresUser} WITH PASSWORD '${postgresPassword}' CREATEDB;
      CREATE DATABASE ${postgresDb} OWNER ${postgresUser};
    '';
  };
}
