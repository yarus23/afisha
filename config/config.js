﻿var Global = {
	//
	debug: false,
	server_url: 'http://afisha.mikhelev.ru/app/ulanude',//'http://afishache.co.cc/administrator/',
        img_url:'http://afisha.mikhelev.ru/',
	db_name: 'afishache2',
	//
	app_name: 'Афиша Улан-Удэ',
	email: 'gubernia74@gmail.com',
	android_play: 'https://play.google.com/store/apps/details?id=com.afisha.che',
	app_store: 'http://itunes.apple.com/us/app/id520794707',
	//Google Analytics
	ga: 'UA-31136083-1',
	adv: 'http://ads.adfox.ru/210050/getCode?p1=bkuvw&p2=eteb&pfc=a&pfb=a&plp=a&pli=a&pop=a',
	banner_adv: 'http://ads.adfox.ru/210050/getCode?p1=bkuwg&p2=etee&pfc=a&pfb=a&plp=a&pli=a&pop=a',
	//
	providers: {
		_default: {
			redirect_uri: 'http://afisha.mikhelev.ru/oauth'
		},
		vk: {
			app_id: '3668131'
		},
		google: {
			client_id: '600483226099.apps.googleusercontent.com'
		},
		fb: {
			app_id: '338336639627841'
		},
		odnoklassniki: {
			app_id: '176776704',
			secret_key: '25AE2BE7C37BFE599351223F',
			public_key: 'CBAHGKILABABABABA'
		},
		mailru: {
			app_id: '705303',
			secret_key: '48832a70957038bb399aa64e69ca9632'
		},
		twitter: {
			consumer_key: 'RiX4Wo1l4gTEuWFdHgVng',
			consumer_secret: 'ulM5JRidDU3RuJchXk3nR12eUMp0glkixch6fsznXzU'
		}
	}
};

Global.license_agreement = 
'<b>Лицензионное соглашение на использование программы ' + Global.app_name + ' для мобильных устройств</b><br/><br/>\
Перед использованием программы, пожалуйста, ознакомьтесь с условиями настоящего лицензионного соглашения.<br/><br/>\
Любое использование Вами программы означает полное и безоговорочное принятие Вами условий настоящего лицензионного соглашения.<br/>\
Если Вы не принимаете условия лицензионного соглашения в полном объеме, Вы не имеете права использовать программу в каких-либо целях.<br/><br/>\
1.       Лицензия<br/>\
1.1.  Настоящее Лицензионное соглашение («Лицензия») заключено между Вами, пользователем («Пользователь»), и Индустрия отдыха, г. Челябинск, пр. Ленина, дом 116, являющимся правообладателем исключительных прав на программу («Правообладатель»). Лицензия устанавливает условия использования Пользователем программы ' + Global.app_name + ' для мобильных устройств («Программа»).<br/><br/>\
1.2.  Копируя Программу и устанавливая его на свое мобильное устройство, Пользователь выражает свое полное и безоговорочное согласие со всеми условиями Лицензии.<br/><br/>\
1.3.  Использование Программы разрешается только на условиях настоящей Лицензии. Если Пользователь не принимает условия Лицензии в полном объеме, Пользователь не имеет права использовать Программу в каких-либо целях. Использование Программы с нарушением (невыполнением) какого-либо  условия Лицензии запрещено.<br/><br/>\
1.4.  Использование Программы на условиях настоящей Лицензии в личных некоммерческих целях осуществляется безвозмездно. Использование Программы на условиях и способами, не предусмотренными настоящей Лицензией, возможно только на основании отдельного соглашения с Правообладателем.<br/><br/>\
2.       Права на Программу<br/>\
2.1. Исключительное право на Программу принадлежит Правообладателю.<br/><br/>\
3.       Права Пользователя<br/><br/>\
3.1.  Правообладатель предоставляет Пользователю неисключительное непередаваемое право (простая лицензия) использовать Программу следующими способами:<br/><br/>\
3.1.1.  Применять Программу по прямому функциональному назначению, в целях чего произвести ее копирование и установку на мобильное (ые) устройство (ва) Пользователя. Пользователь вправе произвести установку Программы на неограниченное число мобильных устройств.<br/><br/>\
3.1.2.  Воспроизводить и распространять Программу в некоммерческих целях (безвозмездно).<br/><br/>\
3.2.  Программа должна использоваться под наименованием: ' + Global.app_name + '. Пользователь не вправе изменять и/или удалять наименование Программы, знак охраны авторского права или иные указания на Правообладателя.<br/><br/>\
4.       Условия использования Информации<br/>\
4.1.  Информационные материалы любых типов и форм представления, в том числе тексты, изображения, фотографии, аудио- и видеоматериалы (по тексту — «Информационные каналы»), доступные посредством Программы, или посредством размещенных в Программе ссылок на другие сайты, предоставляются интернет – ресурсами в режиме свободного доступа, и (или) партнерами ' + Global.app_name + ' на основе двусторонних соглашений. Права на указанную Информацию принадлежат интернет - ресурсам или иным правообладателям (обладатели информации). Информация доступна в Программе исключительно в режиме цитирования в информационных целях. Пользователи не получают никаких прав на использование Информации вне рамок возможностей, предоставляемых Программой, и несут полную ответственность перед правообладателем за их неправомерное использование.<br/><br/>\
4.2.  Информационные каналы формируются полностью автоматически. ' + Global.app_name + ' не осуществляет производства и распространения собственной Информации, в т.ч. новостей.<br/><br/>\
4.3.    ' + Global.app_name + ' автоматически обновляет,  индексирует и систематизирует Информационные каналы, предоставляемые интернет - ресурсами, с целью предоставления Пользователям возможности доступа с мобильных устройств к общедоступной новостной информации, размещенной в сети Интернет.<br/><br/>\
4.4.    ' + Global.app_name + ' не осуществляет никаких изменений и исправлений Информации, предоставляемой Партнерами Сервиса, кроме производимых в автоматическом режиме систематизации и аннотирования Информации.<br/><br/>\
5.       Ограничения<br/>\
5.1.    За исключением использования в объемах и способами, прямо предусмотренными настоящей Лицензией или законодательством РФ, Пользователь не имеет права изменять, декомпилировать, дизассемблировать, дешифровать и производить иные действия с объектным кодом Программы, имеющие целью получение информации о реализации алгоритмов, используемых в Программе, создавать производные произведения с использованием Программы, а также осуществлять (разрешать осуществлять) иное использование Программы, без письменного согласия Правообладателя.<br/><br/>\
5.2.    Пользователь не имеет право воспроизводить и распространять Программу в коммерческих целях (за плату), в том числе в составе сборников программных продуктов, без письменного согласия Правообладателя.<br/><br/>\
5.3.    Пользователь не имеет права распространять Программу в виде, отличном от того, в котором он ее получил, без письменного согласия Правообладателя.<br/><br/>\
6.       Особые условия<br/>\
6.1.    Выполнение некоторых функций Программы возможно только при наличии доступа к сети интернет. Пользователь самостоятельно получает и оплачивает такой доступ на условиях и по тарифам своего оператора связи или провайдера доступа к сети интернет.<br/><br/>\
7.       Ответственность по Лицензии<br/>\
7.1.    Программа (включая Данные) предоставляется на условиях "как есть" (as is). Правообладатель не предоставляет никаких гарантий в отношении безошибочной и бесперебойной работы Программы или отдельных ее компонентов, соответствия Программы конкретным целям Пользователя, не гарантирует достоверность, точность, полноту и своевременность «Данных», а также не предоставляет никаких иных гарантий, прямо не указанных в настоящей Лицензии.<br/><br/>\
7.2.    В максимальной степени, допустимой действующим законодательством, Правообладатель, равно как и его партнеры, не несет никакой ответственности за какие-либо прямые или косвенные последствия какого-либо использования или невозможности использования Программы (включая Данные) и/или ущерб, причиненный Пользователю и/или третьим сторонам в результате какого-либо использования или неиспользования Программы (включая Данные) или отдельных ее компонентов, в том числе из-за возможных ошибок или сбоев в их работе.<br/><br/>\
7.3.    Все претензии, связанные с использованием/невозможностью использования Программы или Данных, а также возможным нарушением Программой или Данными законодательства и/или прав третьих лиц, должны направляться по электронной почте по адресу <a href="mailto:pvk1978@gmail.com,ftech@tula.net">pvk1978@gmail.com</a><br/><br/>\
7.4.    Настоящая Лицензия и все отношения, связанные с использованием Программы, регулируются Законодательством РФ.<br/>';
