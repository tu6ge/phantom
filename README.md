# 把网页转成图片

机器需要安装docker和docker-compose
在当前目录运行

```
docker-compose -d [ --build] #首次运行，需要加上--build
```

nginx配置，改成如下

```
server{
	...
	location /web_screenshot/ {
        proxy_pass      http://web_screenshot/;
            proxy_redirect  off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
	...
}
upstream web_screenshot{
    server 127.0.0.1:9876;
}
```

然后把需要转换成图片的网址，进行base64加密
比如 https://www.baidu.com 转码后 aHR0cHM6Ly93d3cuYmFpZHUuY29t 

用浏览器访问 http://domain/web_screenshot/?url=aHR0cHM6Ly93d3cuYmFpZHUuY29t 即可获取百度的首页截图