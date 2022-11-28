import {window, ViewColumn, Uri, WebviewPanel} from 'vscode';

export default class PreviewWebViewPanel {

	public static readonly viewType = 'nc-start-project.preview';
  private instance: PreviewWebViewPanel | undefined;
  // TODO: 默认端口是3001，vscode没有提供端口监控api
  private port: number = 3001;
  private extensionUri: Uri | undefined;
  protected panel: WebviewPanel | undefined;

  constructor(extensionUri: Uri, port = 3001) {
    if (this.instance instanceof PreviewWebViewPanel) {
      return this.instance;
    }
    this.port = port;
    this.extensionUri = extensionUri;
    this.instance = this;
  }

	public show() {
    if (this.panel) {return;}
    this.panel = window.createWebviewPanel(
      PreviewWebViewPanel.viewType,
      "预览",
      ViewColumn.Beside,
      {
        enableScripts: true,
        enableFindWidget: true
      }
    );
		this.panel.webview.html = this._getHtmlForWebview();
	}

  public updatePort(port: number) {
    this.port = port;
    this.panel && (this.panel.webview.html = this._getHtmlForWebview());
  }

	private _getHtmlForWebview() {

		// Get resource paths
		const styleUri = this.panel!.webview.asWebviewUri(Uri.joinPath(this.extensionUri!, 'assets', 'style.css'));
		const gifUri = this.panel!.webview.asWebviewUri(Uri.joinPath(this.extensionUri!, 'assets', 'loading.gif'));
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Porject Preview</title>
				<link href="${styleUri}" rel="stylesheet" />
			</head>
			<body>
				<div class="toolbar">
					<div class="refresh">
						<svg width="12" height="12" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_4333_9322)">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M13.4168 1.75C13.739 1.75 14.0002 2.01117 14.0002 2.33333V5.83333C14.0002 6.1555 13.739 6.41667 13.4168 6.41667H9.91683C9.59466 6.41667 9.3335 6.1555 9.3335 5.83333C9.3335 5.51117 9.59466 5.25 9.91683 5.25H12.8335V2.33333C12.8335 2.01117 13.0947 1.75 13.4168 1.75Z" fill="currentColor"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8.16683C0 7.84466 0.261167 7.5835 0.583333 7.5835H4.08333C4.4055 7.5835 4.66667 7.84466 4.66667 8.16683C4.66667 8.489 4.4055 8.75016 4.08333 8.75016H1.16667V11.6668C1.16667 11.989 0.9055 12.2502 0.583333 12.2502C0.261167 12.2502 0 11.989 0 11.6668V8.16683Z" fill="currentColor"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" d="M8.29344 2.5184C7.53618 2.29936 6.73577 2.27572 5.9669 2.44969C5.19803 2.62366 4.48576 2.98956 3.89655 3.51326C3.30734 4.03695 2.8604 4.70137 2.59742 5.44452C2.48995 5.74823 2.15662 5.90731 1.8529 5.79984C1.54919 5.69237 1.39011 5.35904 1.49758 5.05532C1.8263 4.12639 2.38499 3.29586 3.1215 2.64124C3.85801 1.98662 4.74835 1.52925 5.70944 1.31179C6.67052 1.09433 7.67104 1.12388 8.61762 1.39768C9.56119 1.67061 10.4205 2.17737 11.1159 2.87091L13.8161 5.40815C14.0509 5.62876 14.0624 5.99793 13.8418 6.23271C13.6212 6.46749 13.252 6.47897 13.0172 6.25836L10.3106 3.71503C10.3061 3.71085 10.3017 3.70661 10.2974 3.7023C9.74014 3.14474 9.05071 2.73744 8.29344 2.5184ZM0.158229 7.76714C0.378841 7.53236 0.748009 7.52087 0.982788 7.74148L3.68945 10.2848C3.6939 10.289 3.69827 10.2932 3.70258 10.2975C4.25986 10.8551 4.9493 11.2624 5.70656 11.4814C6.46382 11.7005 7.26423 11.7241 8.0331 11.5502C8.80197 11.3762 9.51424 11.0103 10.1035 10.4866C10.6927 9.96289 11.1396 9.29847 11.4026 8.55532C11.5101 8.25161 11.8434 8.09253 12.1471 8.2C12.4508 8.30748 12.6099 8.64081 12.5024 8.94452C12.1737 9.87346 11.615 10.704 10.8785 11.3586C10.142 12.0132 9.25166 12.4706 8.29057 12.6881C7.32948 12.9055 6.32897 12.876 5.38239 12.6022C4.43882 12.3292 3.57949 11.8225 2.88406 11.1289L0.183882 8.5917C-0.0508975 8.37108 -0.0623826 8.00192 0.158229 7.76714Z" fill="currentColor"></path>
							</g>
							<defs>
							<clipPath id="clip0_4333_9322">
								<rect width="14" height="14" fill="white"></rect>
							</clipPath>
							</defs>
						</svg>
					</div>
					<input type="text" class="input" title="回车更新预览链接，注意链接的端口号">
				</div>
				<div class="container">
					<div style="flex: 1">
					  <iframe class="iframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals" style="background-color: white; display: block;"></iframe>
					</div>
				</div>
        <div class="loading">
          <img src="${gifUri}" />
        </div>
				<script>
          var refreshEl = document.querySelector('.refresh');
          var inputEl = document.querySelector('.input');
          var iframeEl = document.querySelector('.iframe');
          var loadingEl = document.querySelector('.loading');
          var host = location.host;
          // var host = '68cc6c2f-c9a2-4062-809f-69b9aea4b022.ocean-dev.nowcoder.com';
          var url = 'https://port${this.port}-' + host;
          inputEl.value = url;
          iframeEl.onload = iframeEl.onerror = function() {
            loadingEl.style.display = 'none';
          }
          // 初始设置链接
          iframeEl.src = url;
          // 点击刷新
          refreshEl.onclick = function() {
            loadingEl.style.display = 'block';
            iframeEl.src = url;
          }
          inputEl.onkeydown = function(e) {
            if (e.key === 'Enter') {
              loadingEl.style.display = 'block';
              iframeEl.src = inputEl.value;
            }
          }
				</script>
			</body>
			</html>`;
	}

  dispose() {
    this.panel?.dispose();
  }
}