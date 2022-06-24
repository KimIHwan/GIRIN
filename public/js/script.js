let addElementsBtn = document.getElementById('addElementBtn');
let elementList = document.querySelector('.elementList');
let elementDiv = document.querySelectorAll('.elementDiv')[0];

addElementsBtn.addEventListener('click', () => {
    let newElements = elementDiv.cloneNode(true);
    let input = newElements.getElementsByTagName('input')[0];
    input.value = '';
    elementList.appendChild(newElements);
})
// 글 작성 및 수정에서 element 추가 버튼 기능