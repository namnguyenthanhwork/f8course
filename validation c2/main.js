function Validator(formSelector) {
    var formRules = {};
    var _this = this;

    function getParent(inputElement, selector) {
        return inputElement.closest(selector)
    }
    // quy ước tạo rules
    // Nguyên tắc rules
    // 1. Khi có lỗi => trả message lỗi
    // 2. Khi hợp lệ => không trả ra gì (undefined)
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này !'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email !'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Không đủ độ dài yêu cầu (tối thiểu ${min} ký tự)`
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Không đủ độ dài yêu cầu (tối thiểu ${max} ký tự)`;
            }
        }
    };


    var formElement = document.querySelector(formSelector);

    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')

        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|')

            for (var rule of rules) {
                var ruleInfo;
                var isRuleHasValue = rule.includes(':');

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }

                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // lắng nghe sự kiện để validate (blur, change...))

            input.onblur = handleValidate;
            input.oninput = handleChange;
        }

        // hàm thực hiện validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            // nếu có lỗi thì hiển thị message lỗi ra ui
            if (errorMessage) {
                var formGourp = getParent(event.target, '.form-group');
                if (formGourp) {
                    var formMessage = formGourp.querySelector('.form-message');

                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                        formGourp.classList.add('invalid')
                    }
                }
            }

            return !errorMessage;
        }

        // hàm clear message lỗi
        function handleChange(event) {
            var formGourp = getParent(event.target, '.form-group');
            if (formGourp.classList.contains('invalid')) {
                formGourp.classList.remove('invalid')
                var formMessage = formGourp.querySelector('.form-message');

                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }
    }

    // xử lý submit form
    formElement.onsubmit = function (event) {
        event.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;

        for (var input of inputs) {
            if (!handleValidate({
                    target: input
                })) {
                isValid = false;
            }
        }

        if (isValid) {
            if (typeof _this.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]')
                var formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';
                                return values;
                            };
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {})
                // gọi lại hàm và trả về giá trị của form
                _this.onSubmit(formValues)
            } else
                formElement.submit();
        }
    }
}