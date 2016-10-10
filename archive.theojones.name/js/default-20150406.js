/**
 Helper Javascript functions for Known

 If you need to add your own JavaScript, the best thing to do is to create your own js files
 and reference them from a custom plugin or template.

 @package idno
 @subpackage core
 */

/**
 *** Content creation
 */

function bindControls() {
    $('.acl-option').click(function () {
        $('#access-control-id').val($(this).attr('data-acl'));
        $('#acl-text').html($(this).html());
    });
    $('.syndication-toggle input[type=checkbox]').bootstrapToggle();
    $('.ignore-this').hide();
}

var isCreateFormVisible = false;

function contentCreateForm(plugin) {
    if (isCreateFormVisible) {
        // Ignore additional clicks on create button
        return;
    }

    isCreateFormVisible = true;
    $.ajax(wwwroot() + plugin + '/edit/', {
        dataType: 'html',
        success: function (data) {
            $('#contentCreate').html(data).slideDown(400);
            $('#contentTypeButtonBar').slideUp(400);
            window.contentCreateType = plugin;
            window.contentPage = true;

            bindControls();
        },
        error: function (error) {
            $('#contentTypeButtonBar').slideDown(400);
            isCreateFormVisible = false;
        }

    });
}

function hideContentCreateForm() {
    isCreateFormVisible = false;
    if (window.contentPage == true) {
        $('#contentTypeButtonBar').slideDown(200);
        $('#contentCreate').slideUp(200);
    } else {
        //window.close(); // Will only fire for child windows
        if (window.history.length > 1) {
            window.history.back();
        }
    }
}

/**
 * Periodically send the current values of this form to the server.
 *
 * @param string context Usually the type of entity being saved. We keep one autosave
 *     for each unique context.
 * @param array elements The elements to save, e.g. ["title", "body"].
 * @param object selectors (optional) A mapping from element name to its unique
 *     JQuery-style selector. If no mapping is provided, defaults to "#element";
 */
function autoSave(context, elements, selectors) {
    var previousVal = {};
    setInterval(function () {
        var changed = {};
        for (var i = 0 ; i < elements.length ; i++) {
            var element = elements[i];
            var selector = "#" + element;
            if (selectors && element in selectors) {
                selector = selectors[element];
            }
            var val = false;
            if ($(selector).val() != previousVal[element]) {
                val = $(selector).val();
            }
            if (val !== false) {
                changed[element] = val;
                previousVal[element] = val;
            }
        }
        if (Object.keys(changed).length > 0) {
            $.post(wwwroot() + 'autosave/',
                {
                    "context": context,
                    "elements": changed,
                    "names": elements
                },
                function() {
                }
            );
        }
    }, 10000);
}

function knownStripHTML(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function htmlEntityDecode(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}
