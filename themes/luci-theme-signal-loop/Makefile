#
# luci-theme-signal-loop
#
# A LuCI / OpenWrt admin theme based on the official "Bootstrap" theme and
# skinned after the visual language of https://dd-wrt.com/ (charcoal panels,
# steel-blue gradients, orange highlights and compact Verdana typography).
#
# The page scaffolding is derived from the official LuCI Bootstrap theme:
#   luci-theme-bootstrap
#   Copyright 2008 Steven Barth <steven@midlink.org>
#   Copyright 2008-2012 Jo-Philipp Wich <jow@openwrt.org>
#   Copyright 2012 David Menting <david@nut-bolt.nl>
#   Licensed to the public under the Apache License 2.0.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the Apache License, Version 2.0.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-theme-signal-loop

# The CI workflow passes the release/tag version in SIGNAL_LOOP_VERSION.
# Using a custom variable keeps the override local to this package; passing
# PKG_VERSION on the make command line would also override the version of
# every host tool and dependency built by the SDK.
ifneq ($(SIGNAL_LOOP_VERSION),)
PKG_VERSION:=$(SIGNAL_LOOP_VERSION)
else
PKG_VERSION:=1.0.0
endif

PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Signal Loop Theme Authors

# The theme ships only static assets (ucode templates, CSS, JS and images), so
# it is packaged directly without the LuCI feed's template/minify host tools.
# This keeps SDK builds fast and self-contained.
include $(INCLUDE_DIR)/package.mk

# There is no source tree to build, so override the default build stages.
# Without these the default Build/Compile runs `make` inside the empty
# $(PKG_BUILD_DIR) and fails with "No targets specified and no makefile found".
define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Compile
endef

define Package/luci-theme-signal-loop
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=4. Themes
  TITLE:=Signal Loop Theme
  DEPENDS:=+luci-base
  PKGARCH:=all
endef

define Package/luci-theme-signal-loop/description
  Signal Loop is a LuCI theme built on the official Bootstrap layout and
  styled after dd-wrt.com: a dark charcoal interface with steel-blue
  gradient bars, orange highlights, compact Verdana typography and the
  classic signal/status treatment of the DD-WRT web interface.
endef

define Package/luci-theme-signal-loop/install
	$(INSTALL_DIR) $(1)/www
	$(CP) $(CURDIR)/htdocs/. $(1)/www/
	$(INSTALL_DIR) $(1)/usr/share/ucode/luci
	$(CP) $(CURDIR)/ucode/. $(1)/usr/share/ucode/luci/
	$(CP) $(CURDIR)/root/. $(1)/
endef

define Package/luci-theme-signal-loop/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.SignalLoop
	uci commit luci
}
endef

$(eval $(call BuildPackage,luci-theme-signal-loop))
