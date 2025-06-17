function nowTimeToStr() {
	const now = new Date();
	const year = now.getFullYear().toString().substring(2);
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const hour = now.getHours().toString().padStart(2, '0');
	const minute = now.getMinutes().toString().padStart(2, '0');
	const second = now.getSeconds().toString().padStart(2, '0');
	const str1 = `${year}${month}${day}${hour}${minute}${second}`;
	const str2 = `${year}/${month}/${day}/ ${hour}:${minute}:${second}`;
	return [str1, str2];
}

const app = new Vue({
	el: '#app',
	data: {
		words: "",
		nowLevelIndex: 0,
		upDownIndex: 1,
		showSaveImport: false,
		navs: [],
		levels: [
			"./images/ico-t.png",
			"./images/ico-h1.png",
			"./images/ico-h2.png",
			"./images/ico-h3.png",
			"./images/ico-p.png",
			"./images/ico-p1.png",
			"./images/ico-p2.png",
			"./images/ico-p3.png",
			"./images/ico-p4.png",
			"./images/ico-l1.png",
			"./images/ico-l2.png",
			"./images/ico-l3.png",
			"./images/ico-l4.png",
		],
		fnCnts: [
			{name: '页面+1', clickEvent: 'addPage'},
			{name: '页面-1', clickEvent:  'delPage'},
			{name: '删除最新', clickEvent: 'delLastest'},
			{name: '保存/导入', clickEvent:  'save/import'},
			{name: '导出图片', clickEvent:  'outPng'},
			{name: '清空页面', clickEvent:  'clearPages'},
		],
		symbols: [
			{imgUrl: './images/ico-symbol-1.png', clickText: ' &lt;&gt; '},
			{imgUrl: './images/ico-symbol-2.png', clickText: ' &lt;/&gt; '},
			{imgUrl: './images/ico-symbol-3.png', clickText: ' <b> '},
			{imgUrl: './images/ico-symbol-4.png', clickText: ' </b> '},
			{imgUrl: './images/ico-symbol-5.png', clickText: ' <hr> '},
			{imgUrl: './images/ico-symbol-6.png', clickText: ' <hr> '},
			{imgUrl: './images/ico-symbol-7.png', clickText: ' &rArr; '},
			{imgUrl: './images/ico-symbol-8.png', clickText: ' &hArr; '},
			{imgUrl: './images/ico-symbol-9.png', clickText: ' &rarr;'},
			{imgUrl: './images/ico-symbol-10.png', clickText: ' &sim; '}
		],
		upOrDown: [
			{imgUrl: "./images/ico-up.png", style: "translate(-50%, 90%)"},
			{imgUrl: "./images/ico-down.png", style: "translate(-50%, 0)"}
		],
		bodyContents: [
			[]
		],
		levelCount: {
			'T': 0,
			'H1': 0,
			'H2': 0,
			'H3': 0
		}
	},
	methods: {
		csHandleClick: function (index) {
			this.nowLevelIndex=index;
			document.querySelector('#in-cnt input').focus();
		},
		fnHandleClick: function(eventName) {
			switch(eventName) {
				case 'addPage':
					this.bodyContents.push([])
					break;
				case 'delPage':
					if (this.bodyContents.length > 1) {
						if (confirm('确认删除？')) {
							this.bodyContents.pop()
						}
					} else {
						alert('仅剩一页，无法执行删除操作！')
					}
					break;
				case 'delLastest':
					let delElement = this.bodyContents[this.bodyContents.length -1].pop()
					if (delElement.startsWith("<h2>")) {
						this.levelCount.H1 -= 1
					} else if (delElement.startsWith("<h3>")) {
						this.levelCount.H2 -= 1
					} else if (delElement.startsWith("<h4>")) {
						this.levelCount.H3 -= 1
					}
					navigator.clipboard.writeText(delElement)
					break;
				case 'clearPages':
					if (confirm('确认清空页面？')) {
						this.bodyContents = [[]]
					}
					break;
				case 'save/import':
					this.showSaveImport = !this.showSaveImport
					fetch("/get-nav")
						.then(res => res.json())
						.then(data => {
							this.navs = data.map((item) => {
								if (item.title.length >= 6) {
									item.title = item.title.substring(0, 5) + "..."
								}
								return item
							})
						})
					break
				case 'outPng':
					const pageNode = document.querySelectorAll('#pages .page')
					let i = 0;
					pageNode.forEach(node => {
						domtoimage.toPng(node, {
							quality: 1,
							style: {
								transformOrigin: 'top left',
								transform: 'scale(5)'
							},
							width: node.clientWidth * 5,
							height: node.clientHeight * 5,
						})
							.then(dataUrl=>{
								let nowTime = new Date();
								let year = String(nowTime.getFullYear()).substring(2)
								let month = String(nowTime.getMonth() + 1).padStart(2, '0')
								let day = String(nowTime.getDate()).padStart(2, '0')
								let hour = String(nowTime.getHours()).padStart(2, '0')
								let minute = String(nowTime.getMinutes()).padStart(2, '0')
								let second = String(nowTime.getSeconds()).padStart(2, '0')
								let order = String(++i).padStart(2, '0')
								let downloadLink = document.createElement('a');
								downloadLink.href = dataUrl;
								downloadLink.download = `Note-${year}${month}${day}${hour}${minute}${second}-${order}.png`;
								downloadLink.click();
							})
					})
			}
		},
		inHandleEnter: function() {
			switch(this.nowLevelIndex) {
				case 0:
					if (this.levelCount.T !== 0) {
						this.bodyContents[0][0] = '<h1>' + this.words + '</h1>'
					} else {
						this.levelCount.T += 1;
						this.bodyContents[0].unshift('<h1>' + this.words + '</h1>')
					}
					break;
				case 1:
					this.levelCount.H1 += 1;
					this.bodyContents[this.bodyContents.length-1].push('<h2>' + this.levelCount.H1 + ' ' + this.words + '</h2>')
					this.levelCount.H2 = 0;
					this.levelCount.H3 = 0;
					break;
				case 2:
					if (this.levelCount.H1 === 0) {alert('请先输入一级标题');return;}
					this.levelCount.H2 += 1;
					this.bodyContents[this.bodyContents.length-1].push('<h3>' + this.levelCount.H1 + '.' + this.levelCount.H2 + ' ' + this.words + '</h3>')
					this.levelCount.H3 = 0;
					break;
				case 3:
					if (this.levelCount.H1 === 0) {alert('请先输入一级标题');return;}
					if (this.levelCount.H2 === 0) {alert('请先输入二级标题');return;}
					this.levelCount.H3 += 1;
					const h3Header =  this.levelCount.H1 + '.' + this.levelCount.H2 + '.' + this.levelCount.H3 + ' '
					this.bodyContents[this.bodyContents.length-1].push('<h4>' + h3Header + this.words + '</h4>')
					break;
				case 4:
					this.bodyContents[this.bodyContents.length-1].push('<p>&#9475;' + this.words + '</p>')
					break;
				case 5:
					this.bodyContents[this.bodyContents.length-1].push('<p class="tab1">' + this.words + '</p>')
					break;
				case 6:
					this.bodyContents[this.bodyContents.length-1].push('<p class="tab2">' + this.words + '</p>')
					break;
				case 7:
					this.bodyContents[this.bodyContents.length-1].push('<p class="tab3">' + this.words + '</p>')
					break;
				case 8:
					this.bodyContents[this.bodyContents.length-1].push('<p class="tab4">' + this.words + '</p>')
					break;
				case 9:
					this.bodyContents[this.bodyContents.length-1].push('<p class="level1">&#9679; ' + this.words + '</p>')
					break;
				case 10:
					this.bodyContents[this.bodyContents.length-1].push('<p class="level2">&#9632; ' + this.words + '</p>')
					break;
				case 11:
					this.bodyContents[this.bodyContents.length-1].push('<p class="level3">&#9688; ' + this.words + '</p>')
					break;
				case 12:
					this.bodyContents[this.bodyContents.length-1].push('<p class="level4">&#9672; ' + this.words + '</p>')
					break;
			}

			this.words="";
		},
		inButtonClick: function() {
			if (this.upDownIndex === 0) {
				this.upDownIndex = 1;
				document.querySelector('#in-cnt input').focus();
			} else {
				this.upDownIndex = 0
			}
		},
		inSymbolClick: function(clickText) {
			const inputBox = document.querySelector('#in-cnt input')
			if (clickText.trim().startsWith('<hr')) {
				this.bodyContents[this.bodyContents.length - 1].push(clickText);
			} else {
				this.words += clickText
			}
			inputBox.focus();
		},
		saveNewFile: function() {
			const [id, lastestSave] = nowTimeToStr()
			let title = document.querySelector('h1');
			if (!title) {
				title = "无标题"
			} else {
				title = title.textContent
			}
			const content = this.bodyContents.filter(item => item.length !== 0)
			const pageNum = content.length;
			const saveData = {
				'id': id,
				'title': title,
				'content': content,
				'pageNum': pageNum,
				'lastestSave': lastestSave
			}
			fetch('/save-data', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(saveData),
			})
				.then(res => res.json())
				.then(res => {
					this.navs = res.map((item) => {
						if (item.title.length >= 6) {
							item.title = item.title.substring(0, 5) + "..."
						}
						return item
					})
				})
		},
		procRecords: function(id, fnCode) {
			switch(fnCode) {
				case 0:
					const pageNum = this.bodyContents.filter(item => item.length !== 0).length
					if (pageNum !== 0) {
						let title = document.querySelector('h1');
						if (!title) {
							title = "无标题"
						} else {
							title = title.textContent
						}
						const postData = {
							'id': id,
							'title': title,
							"content": this.bodyContents,
							'lastestSave': nowTimeToStr()[1],
							"pageNum": this.bodyContents.filter(item => item.length !== 0).length,
						}
						fetch('/update', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(postData)
						})
							.then(res => res.json())
							.then(res => {
								this.navs = res.map((item) => {
									if (item.title.length >= 6) {
										item.title = item.title.substring(0, 5) + "..."
									}
									return item
								})
							})
					} else {
						alert('新的内容为空，禁止写入！')
					}
					this.showSaveImport = !this.showSaveImport
					break
				case 1:
					fetch(`/get-ctt?id=${id}`)
						.then(res => res.json())
						.then(res => {
							this.bodyContents = res['content'];
							this.showSaveImport = false;
						})
					break
				case 2:
					if (confirm('确认删除吗？')) {
						fetch(`/del-data?id=${id}`)
							.then(res => res.json())
							.then(res => {
								this.navs = res.map((item) => {
									if (item.title.length >= 6) {
										item.title = item.title.substring(0, 5) + "..."
									}
									return item
								})
							})
					}
					break
			}
		}
	}
})