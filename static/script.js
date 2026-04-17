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
        
        isSubmitting = true;
        btnText.textContent = '提交中...';
        submitBtn.style.opacity = '0.8';
        submitBtn.style.cursor = 'not-allowed';

        const formData = {
            name: document.getElementById('name').value,
            student_id: document.getElementById('student_id').value,
            college: document.getElementById('college').value,
            contact: document.getElementById('contact').value,
            question: document.getElementById('question').value
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
