/*======================================================
************   Navbars && Toolbars   ************
======================================================*/
// On Navbar Init Callback
app.navbarInitCallback = function (view, pageContainer, navbarContainer, navbarInnerContainer) {
    if (!navbarContainer && navbarInnerContainer) navbarContainer = $(navbarInnerContainer).parent('.navbar')[0];
    var navbarData = {
        container: navbarContainer,
        innerContainer: navbarInnerContainer
    };
    var pageData = pageContainer && pageContainer.f7PageData;

    var eventData = {
        page: pageData,
        navbar: navbarData
    };

    if (navbarInnerContainer.f7NavbarInitialized) {
        // Reinit Navbar
        app.reinitNavbar(navbarContainer, navbarInnerContainer);

        // Plugin hook
        app.pluginHook('navbarReinit', pageData);

        // Event
        $(pageData.container).trigger('navbarReinit', eventData);
        return;
    }
    navbarInnerContainer.f7NavbarInitialized = true;

    // Before Init
    app.pluginHook('navbarBeforeInit', navbarData, pageData);
    $(navbarInnerContainer).trigger('navbarBeforeInit', eventData);

    // Initialize Navbar
    app.initNavbar(navbarContainer, navbarInnerContainer);

    // On init
    app.pluginHook('navbarInit', navbarData, pageData);
    $(navbarInnerContainer).trigger('navbarInit', eventData);
};
// Navbar Remove Callback
app.navbarRemoveCallback = function (view, pageContainer, navbarContainer, navbarInnerContainer) {
    if (!navbarContainer && navbarInnerContainer) navbarContainer = $(navbarInnerContainer).parent('.navbar')[0];
    var navbarData = {
        container: navbarContainer,
        innerContainer: navbarInnerContainer
    };
    var pageData = pageContainer.f7PageData;

    var eventData = {
        page: pageData,
        navbar: navbarData
    };
    app.pluginHook('navbarBeforeRemove', navbarData, pageData);
    $(navbarInnerContainer).trigger('navbarBeforeRemove', eventData);
};
app.initNavbar = function (navbarContainer, navbarInnerContainer) {
    // Init Subnavbar Searchbar
    app.initSearchbar(navbarInnerContainer);
};
app.reinitNavbar = function (navbarContainer, navbarInnerContainer) {
    // Re init navbar methods
};
app.initNavbarWithCallback = function (navbarContainer) {
    navbarContainer = $(navbarContainer);
    var viewContainer = navbarContainer.parents('.' + app.params.viewClass);
    if (viewContainer.length === 0) return;
    var view = viewContainer[0].f7View || undefined;
    navbarContainer.find('.navbar-inner').each(function () {
        app.navbarInitCallback(view, undefined, navbarContainer[0], this);
    });
};

// Size Navbars
app.sizeNavbars = function (viewContainer) {
    var navbarInner = viewContainer ? $(viewContainer).find('.navbar .navbar-inner:not(.cached)') : $('.navbar .navbar-inner:not(.cached)');
    navbarInner.each(function () {
        var n = $(this);
        if (n.hasClass('cached')) return;
        var left = app.rtl ? n.find('.right') : n.find('.left'),
            right = app.rtl ? n.find('.left') : n.find('.right'),
            center = n.find('.center'),
            subnavbar = n.find('.subnavbar'),
            noLeft = left.length === 0,
            noRight = right.length === 0,
            leftWidth = noLeft ? 0 : left.outerWidth(true),
            rightWidth = noRight ? 0 : right.outerWidth(true),
            centerWidth = center.outerWidth(true),
            navbarWidth = n[0].offsetWidth - parseInt(n.css('padding-left'), 10) - parseInt(n.css('padding-right'), 10),
            onLeft = n.hasClass('navbar-on-left'),
            currLeft, diff;

        if (noRight) {
            currLeft = navbarWidth - centerWidth;
        }
        if (noLeft) {
            currLeft = 0;
        }
        if (!noLeft && !noRight) {
            currLeft = (navbarWidth - rightWidth - centerWidth + leftWidth) / 2;
        }
        var requiredLeft = (navbarWidth - centerWidth) / 2;
        if (navbarWidth - leftWidth - rightWidth > centerWidth) {
            if (requiredLeft < leftWidth) {
                requiredLeft = leftWidth;
            }
            if (requiredLeft + centerWidth > navbarWidth - rightWidth) {
                requiredLeft = navbarWidth - rightWidth - centerWidth;
            }
            diff = requiredLeft - currLeft;
        }
        else {
            diff = 0;
        }
        // RTL inverter
        var inverter = app.rtl ? -1 : 1;
        
        // Center left
        var centerLeft = diff;
        if (app.rtl && noLeft && noRight && center.length > 0) centerLeft = -centerLeft;
        center.css({left: centerLeft + 'px'});

        if (center.hasClass('sliding')) {
            center[0].f7NavbarLeftOffset = -(currLeft + diff) * inverter;
            center[0].f7NavbarRightOffset = (navbarWidth - currLeft - diff - centerWidth) * inverter;
            if (onLeft) center.transform('translate3d(' + center[0].f7NavbarLeftOffset + 'px, 0, 0)');
        }
        if (!noLeft && left.hasClass('sliding')) {
            if (app.rtl) {
                left[0].f7NavbarLeftOffset = -(navbarWidth - left.outerWidth()) / 2 * inverter;
                left[0].f7NavbarRightOffset = leftWidth * inverter;
            }
            else {
                left[0].f7NavbarLeftOffset = -leftWidth;
                left[0].f7NavbarRightOffset = (navbarWidth - left.outerWidth()) / 2;
            }
            if (onLeft) left.transform('translate3d(' + left[0].f7NavbarLeftOffset + 'px, 0, 0)');
        }
        if (!noRight && right.hasClass('sliding')) {
            if (app.rtl) {
                right[0].f7NavbarLeftOffset = -rightWidth * inverter;
                right[0].f7NavbarRightOffset = (navbarWidth - right.outerWidth()) / 2 * inverter;
            }
            else {
                right[0].f7NavbarLeftOffset = -(navbarWidth - right.outerWidth()) / 2;
                right[0].f7NavbarRightOffset = rightWidth;
            }
            if (onLeft) right.transform('translate3d(' + right[0].f7NavbarLeftOffset + 'px, 0, 0)');
        }
        if (subnavbar.length && subnavbar.hasClass('sliding')) {
            subnavbar[0].f7NavbarLeftOffset = app.rtl ? subnavbar[0].offsetWidth : -subnavbar[0].offsetWidth;
            subnavbar[0].f7NavbarRightOffset = -subnavbar[0].f7NavbarLeftOffset;
        }
        
    });
};

// Hide/Show Navbars/Toolbars
app.hideNavbar = function (navbarContainer) {
    $(navbarContainer).addClass('navbar-hidden');
    return true;
};
app.showNavbar = function (navbarContainer) {
    var navbar = $(navbarContainer);
    navbar.addClass('navbar-hiding').removeClass('navbar-hidden').transitionEnd(function () {
        navbar.removeClass('navbar-hiding');
    });
    return true;
};
app.hideToolbar = function (toolbarContainer) {
    $(toolbarContainer).addClass('toolbar-hidden');
    return true;
};
app.showToolbar = function (toolbarContainer) {
    var toolbar = $(toolbarContainer);
    toolbar.addClass('toolbar-hiding').removeClass('toolbar-hidden').transitionEnd(function () {
        toolbar.removeClass('toolbar-hiding');
    });
};
