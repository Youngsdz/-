document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');
    const toast = document.getElementById('toast');
    let isSubmitting = false;

    function showToast(message, type) {
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // --- 开始表单校验逻辑 ---
        const nameInput = document.getElementById('name');
        const studentIdInput = document.getElementById('student_id');
        const collegeInput = document.getElementById('college');
        const contactInput = document.getElementById('contact');

        // 清除旧的报错信息
        document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));
        document.querySelectorAll('.error-msg').forEach(el => el.remove());

        let isValid = true;
        let firstErrorInput = null;

        const showError = (input, message) => {
            isValid = false;
            input.classList.add('error-border');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-msg';
            errorDiv.textContent = message;
            input.parentElement.appendChild(errorDiv);
            if (!firstErrorInput) firstErrorInput = input;
        };

        // 校验姓名：至少2个字符
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, '请输入真实的姓名');
        }

        // 校验学号：只能是数字和字母，一般长度 > 5
        if (!/^[0-9A-Za-z]{6,20}$/.test(studentIdInput.value.trim())) {
            showError(studentIdInput, '请输入有效的学号');
        }

        // 校验学院：至少2个字符
        if (collegeInput.value.trim().length < 2) {
            showError(collegeInput, '请输入真实的学院全称');
        }

        // 校验手机号码：中国大陆11位手机号正则
        if (!/^1[3-9]\d{9}$/.test(contactInput.value.trim())) {
            showError(contactInput, '请输入11位正确的手机号码');
        }

        if (!isValid) {
            firstErrorInput.focus();
            showToast('请检查标红的错误信息', 'error');
            return;
        }
        // --- 校验结束 ---
        
        isSubmitting = true;
        btnText.textContent = '提交中...';
        submitBtn.style.opacity = '0.8';
        submitBtn.style.cursor = 'not-allowed';

        const formData = {
            name: nameInput.value.trim(),
            student_id: studentIdInput.value.trim(),
            college: collegeInput.value.trim(),
            contact: contactInput.value.trim()
        };

        try {
            // TODO: 修改为你注册的免服务器收集接口（推荐使用 https://formspree.io/）
            // 例如把这个 URL 改成: 'https://formspree.io/f/mwkpoqvx'
            const formspreeEndpoint = 'https://formspree.io/f/xojydvla'; 
            
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Formspree 返回的是纯净的 json，如果 response.ok 说明成功
            if (response.ok) {
                showToast('报名成功！期待我们在讲座上相见。', 'success');
                form.reset();
                // 成功后可以将按钮文字改为已报名
                btnText.textContent = '已成功报名';
                submitBtn.style.background = '#10B981';
                
                // 给一个微小的粒子动画反馈体验
                submitBtn.classList.add('success-animate');
                setTimeout(() => {
                    isSubmitting = false;
                    btnText.textContent = '立即免费报名';
                    submitBtn.style.background = '';
                }, 4000);
            } else {
                // 如果 Formspree 抛出错误可以捕获
                const result = await response.json();
                let errMsg = '报名失败，请稍后重试';
                if (Object.hasOwn(result, 'errors')) {
                    errMsg = result["errors"].map(error => error["message"]).join(", ");
                }
                showToast(errMsg, 'error');
                btnText.textContent = '立即免费报名';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                isSubmitting = false;
            }
        } catch (error) {
            showToast('网络错误，请检查连接', 'error');
            btnText.textContent = '立即免费报名';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            isSubmitting = false;
        }
    });

    // 为学号输入框添加限制（仅字母数字）
    const studentIdInput = document.getElementById('student_id');
    studentIdInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9A-Za-z]/g, '');
    });
});
