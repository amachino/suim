/*
Suim
Copyright (c) 2011, Akinori Machino akinori.machino@gmail.com
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function Suim( id, config )
{
	// Instance Methods
	this.getData        = getData;
	this.getDocument    = getDocument;
	this.getMathML      = getMathML;
	this.getWindow      = getWindow;
	this.getRange       = getRange;
	this.getTeX         = getTeX;
	this.getXML         = getXML;
	this.insertMath     = insertMath;
	this.loadMathML     = loadMathML;
	this.loadXML        = loadXML;
	this.toggleMathMode = toggleMathMode;
	
	
	/* 
		Usage
		new Suim( ID_NAME, CONFIG_OBJECT );
		
		CONFIG_OBJECT
		{
			imagesDir : '/images/',（画像ディレクトリのパス）
			xsltFile : '/xslt/xsltml.xsl',（画像ディレクトリのパス）
			bodyStyle : 'color:#333333; font-size:14pt; line-height:1.2em;',（iframeのbodyスタイル）
			mathStyle : 'font-size:1.0em;',（mstyle要素のスタイル）
			changeMode : true,（数式モードから通常モードへの切替の可否）
			toolbar : true,（ツールバーを使うかどうか）
			fontFamily : 'sans-serif',（通常文のフォント）
			displayStyle : true,（数式をdisplayタイプにするかinlineタイプにするか）
			newLine: true,（改行を許可するか）
			suggestion: true,（候補提示機能を使うか）
			latexConversion: true（LaTeX変換を使うかどうか）
		}
	*/
	
	var FONT_SIZE         = '14pt'; // フォントの大きさ
	var BODY_STYLE        = 'color:#333333; font-size:' + FONT_SIZE + '; line-height:1.2em; font-family:"Lucida Grande",Verdana,Arial,sans-serif'; // エディタのbodyスタイル
	var MATH_DIV_STYLE    = 'padding:0.0em 1.0em; margin:1.0em 0.0em;'; // 別行立て数式のdiv要素のスタイル
	var MATH_SPAN_STYLE   = 'padding:0.0em 0.2em;'; // インライン数式のspan要素のスタイル
	var MATH_STYLE        = 'text-align:center;'; // math要素のスタイル
	var MSTYLE_STYLE      = 'font-size: 1.0em;'; // mstyle要素のスタイル
	var DISPLAYSTYLE      = 'true'; // 数式のdisplaystyle
	var MSPACE_WIDTH      = '1ex'; // mspace要素の幅
	var INPUTTING_STYLE   = 'border-bottom:2px solid #536CBE;'; // 変換前（スペースを押す前）のスタイル
	var CONVERTED_STYLE   = 'border-bottom:2px solid #B5D5FF;'; // 変換後（スペースを押した後）のスタイル
	var CURSOR_WIDTH      = '3px'; // カーソルの幅
	var CURSOR_HEIGHT     = '0.7em'; // カーソルの高さ
	var CURSOR_DEPTH      = '0.2em'; // カーソルの深さ
	var CURSOR_STYLE      = 'background-color:#466DE2;'; // カーソルのスタイル
	var CURSOR_BLINK_RATE = 500; // カーソルの点滅間隔
	var EDITBOX_STYLE     = 'border:dashed 1px #333333; height:0.9em; width:0.5em;'; // エディットボックスのスタイル
	var GROUP_STYLE       = 'background-color:#B5D5FF;'; // 現在入っているmrow要素のスタイル
	var SELECTED_STYLE    = 'background-color:#B5D5FF;'; // 選択した要素のスタイル
	var SUGGEST_LENGTH    = 2; // 候補提示を始める文字数
	var SELECTED_COLOR    = '#95AFD4'; // 候補リストの選択カラー
	var BINARY_ELEMENT    = { 'mfrac':1, 'msub':1, 'msup':1, 'munder':1, 'mover':1, 'mroot':1 }; // 子要素を２つとる要素
	var TRINARY_ELEMENT   = { 'msubsup':1, 'munderover':1 }; // 子要素を３つとる要素
	var UNDEROVER_CHAR    = { 'lim':1, 'max':1, 'min':1, '\u2211':'sum', '\u220F':'prod', '\u22C0':'bigwedge', '\u22C1':'bigvee', '\u22C2':'bigcap', '\u22C3':'bigcup' }; // <munder>等を使う要素
	var LEFT_FENCE        = { '(':1, '[':1, '|':1, '\u2329':'langle' }; // { '(':1, '{':1, '[':1, '|':1 }; // 左括弧
	var RIGHT_FENCE       = { ')':1, '}':1, ']':1, '|':1, 'u232A':'rangle' }; // 右括弧
	var FENCE_PAIR        = { '(':')', ')':'(', '{':'}', '}':'{', '[':']', ']':'[', '|':'|' }; // 括弧のペア
	var FF_SYMBOL_KEYCODE = { 33:'!', 34:'"', 35:'#', 36:'$', 37:'%', 38:'&', 39:"'", 40:'(', 41:')', 42:'*', 43:'+', 44:',', 45:'-', 46:'.', 47:'/', 58:':', 59:';', 60:'<', 61:'=', 62:'>', 63:'?', 95:'_', 64:'@', 91:'[', 92:'\\', 93:']', 94:'^', 96:'`', 123:'{', 124:'|', 125:'}', 126:'~'}; // Firefoxの記号キーコード
	var IMAGES_DIR        = '/images/'; // 画像ディレクトリのパス
	var XSLT_FILE         = '/xslt/xsltml.xsl'; // XSLTファイルのパス
	
	var iframe;            // エディタとして使うiframe
	var iwindow;           // iframeのcontentWindow
	var idocument;         // iframeのcontentDocument
	var range;             // DOM Rangeオブジェクト
	var isMathMode;        // 数式モードフラグ
	var inputting;         // 現在入力中の要素（<mrow id="inputting"></mrow>）
	var cursor;            // カーソル用要素（<mspace id="cursor"></mspace>）
	var isConverted;       // スペースを１回押して変換した状態がtrue
	var currentGroup;      // 現在中に入っているmrow要素
	var selectedNodes;     // 選択されたオブジェクト
	var preConvertedNodes; // 変換前の文字列の保存用
	var blinkInterval;     // カーソルの点滅用setInterval
	var suggest;           // 候補提示用オブジェクト
	
	
	var enableChangeMode = true;
	var enableNewLine    = true;
	var useSuggestion    = true;
	var useToolbar       = false;
	var downloadXSL      = false;
	
	
	if ( document.body ) {
		initialize();
	}
	else {
		Suim.util.addEventListener( window, 'load', initialize );
	}
	
	
	// 新しい行を１つ下に挿入
	function addNewLine()
	{
		if ( !enableNewLine ) { return; }
		
		// 現在中に入っているmath要素を取得
		var math = Suim.util.searchAncestorByTagName( 'math', inputting );
		var mstyle = math.firstChild;
		
		// spanだったらdivに変える
		if ( math.parentNode.childNodes.length == 1
		  && math.parentNode.nodeName.toLowerCase() == 'span' ) {
			math.setAttribute( 'display', 'block' );
			math.setAttribute( 'style', MATH_STYLE );
			mstyle.setAttribute( 'displaystyle', 'true' );
			var span = math.parentNode;
			range.selectNodeContents( span );
			var contents = range.extractContents();
			var div = idocument.createElement( 'div' );
			div.setAttribute( 'class', 'math' );
			div.setAttribute( 'style', MATH_DIV_STYLE );
			div.appendChild( contents );
			span.parentNode.replaceChild( div, span );
		}
		
		// 改行を押した場所より右に残っているものを取得
		range.setStartAfter( inputting );
		range.setEndAfter( mstyle.lastChild );
		var leftover = range.extractContents();
		
		// 改行して，新しいmath要素を作成し，挿入する
		var newMath = createNewMathElement();
		newMath.setAttribute( 'display', 'block' );
		newMath.setAttribute( 'style', MATH_STYLE );
		range.setStartAfter( math );
		range.collapse( true );
		range.insertNode( newMath );
		
		// 前の行の残りがあればそれを挿入
		mstyle = newMath.firstChild;
		mstyle.appendChild( leftover );
		setCursorAtStartIn( mstyle );
	}
	
	
	// DOMをMathMLのオブジェクトに変換（DOMParserがあれば不要）
	function applyMathmlNameSpace( node, mathTree )
	{
		if ( node.nodeType == node.TEXT_NODE ) {
			mathTree.appendChild( idocument.createTextNode( node.nodeValue ) );
			return;
		}
		if ( node.nodeType == node.ELEMENT_NODE ) {
			var mathmlNode = createMathmlElement( node.nodeName );
			if ( node.hasAttribute( 'displaystyle' ) ) {
				mathmlNode.setAttribute( 'displaystyle', node.getAttribute( 'displaystyle' ) );
			}
			if ( node.hasAttribute( 'style' ) ) {
				mathmlNode.setAttribute( 'style', node.getAttribute( 'style' ) );
			}
			if ( node.hasAttribute( 'id' ) ) {
				mathmlNode.setAttribute( 'id', node.getAttribute( 'id' ) );
			}
			if ( node.hasAttribute( 'class' ) ) {
				mathmlNode.setAttribute( 'class', node.getAttribute( 'class' ) );
			}
			mathTree.appendChild( mathmlNode );
			for ( var i = 0; i < node.childNodes.length; i++ ) {
				applyMathmlNameSpace( node.childNodes[ i ], mathmlNode );
			}
		}
	}
	
	
	// ツールバーを作成
	function attachToolbar()
	{
		var div = document.createElement( 'div' );
		div.id = id + '_toolbar';
		div.setAttribute( 'style', 'width:100%; height:34px; overflow:hidden; position:fixed; left:0px; top:0px; display:none; -moz-border-radius-bottomleft:8px; -moz-border-radius-bottomright:8px;' );
		
		var phantom = document.createElement( 'div' );
		phantom.id = id + '_toolbar_phantom';
		phantom.setAttribute( 'style', 'height:34px; display:none;' );
		document.body.insertBefore( phantom, document.body.firstChild );
		
		var tools = document.createElement( 'span' );
		tools.id = id + '_tools';
		tools.style.marginLeft = '15px';
		var mathTools = document.createElement( 'span' );
		mathTools.id = id + '_math_tools';
		mathTools.style.marginLeft = '15px';
		
		if ( enableChangeMode ) {
			div.style.backgroundColor = '#969696';
			mathTools.style.display = 'none';
			tools.style.marginLeft = '15px';
		}
		else {
			div.style.backgroundColor = '#6D84B4';
			tools.style.display = 'none';
		}
		
		div.appendChild( tools );
		div.appendChild( mathTools );
		
		createToolElement( tools, 'Bold', 'bold.gif', function () { execCommand( 'bold', null ); } );
		createToolElement( tools, 'Italic', 'italic.gif', function () { execCommand( 'italic', null ); } );
		createToolElement( tools, 'Underline', 'underline.gif', function () { execCommand( 'underline', null ); } );
		createToolElement( tools, 'Strike Through', 'strike_through.gif', function () { execCommand( 'strikeThrough', null ); } );
		createToolElement( tools, 'Justify Full', 'justify_full.gif', function () { execCommand( 'justifyFull', null ); } );
		createToolElement( tools, 'Justify Left', 'justify_left.gif', function () { execCommand( 'justifyLeft', null ); } );
		createToolElement( tools, 'Justify Center', 'justify_center.gif', function () { execCommand( 'justifyCenter', null ); } );
		createToolElement( tools, 'Justify Right', 'justify_right.gif', function () { execCommand( 'justifyRight', null ); } );
		createToolElement( tools, 'Math Mode', 'math.png', function () { toggleMathMode(); } );
		
		createToolElement( mathTools, 'Fraction', 'frac.gif', function () { insertMath( 'frac' ); } );
		createToolElement( mathTools, 'Root', 'sqrt.gif', function () { insertMath( 'sqrt' ); } );
		createToolElement( mathTools, 'Subscript', 'sub.gif', function () { insertMath( 'sub' ); } );
		createToolElement( mathTools, 'Superscript', 'sup.gif', function () { insertMath( 'sup' ); } );
		createToolElement( mathTools, 'Simultaneous Equations', 'simuleqns.gif', function () { createTable( 2, 1, '{' ); } );
		createToolElement( mathTools, 'Vector', 'vector.gif', function () { createTable( 2, 1, '(' ); } );
		createToolElement( mathTools, 'Matrix', 'matrix.gif', function () { createTable( 2, 2, '(' ); } );
		createToolElement( mathTools, 'Normal Mode', 'normal.png', function () { toggleMathMode(); } );
		
		var closeButton = createToolElement( div, 'Hide Toolbar', 'delete.gif', hideToolbar );
		closeButton.style.position = 'absolute';
		closeButton.style.right = '15px';
		
		document.body.appendChild( div );
		
		Suim.util.addEventListener( iwindow, 'focus', showToolbar );
	}
	
	
	// previousSiblingを<mfrac>や<msub>などに変更する
	function changePreviousSiblingTo( tagName )
	{
		var previousSibling = inputting.previousSibling;
		if ( !previousSibling ) { return; }
		
		// もし直前が<msup>/<mover>だったら，<msubsup>/<munderover>にする
		if ( tagName == 'msub' || tagName == 'munder' ) {
			if ( previousSibling.nodeName == 'msup' || previousSibling.nodeName == 'mover' ) {
				var newTag = ( previousSibling.nodeName == 'msup' ? 'msubsup' : 'munderover' );
				var mathml = createMathmlElement( newTag );
				var mrow1 = previousSibling.firstChild;
				var mrow2 = createMathmlElement( 'mrow' );
				var mrow3 = previousSibling.lastChild;
				range.selectNode( previousSibling ); range.deleteContents();
				var editbox = createEditboxIn( mrow2 );
				mathml.appendChild( mrow1 ); mathml.appendChild( mrow2 ); mathml.appendChild( mrow3 );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( mathml );
				setCursorIn( editbox );
				return;
			}
		}
		
		// もし直前が<msub>/<munder>だったら，<msubsup>/<munderover>にする
		if ( tagName == 'msup' || tagName == 'mover' ) {
			if ( previousSibling.nodeName == 'msub' || previousSibling.nodeName == 'munder' ) {
				var newTag = ( previousSibling.nodeName == 'msub' ? 'msubsup' : 'munderover' );
				var mathml = createMathmlElement( newTag );
				var mrow1 = previousSibling.firstChild;
				var mrow2 = previousSibling.lastChild;
				var mrow3 = createMathmlElement( 'mrow' );
				range.selectNode( previousSibling ); range.deleteContents();
				var editbox = createEditboxIn( mrow3 );
				mathml.appendChild( mrow1 ); mathml.appendChild( mrow2 ); mathml.appendChild( mrow3 );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( mathml );
				setCursorIn( editbox );
				return;
			}
		}
		
		// それ以外
		var mathml = createMathmlElement( tagName );
		var mrow1 = createMathmlElement( 'mrow' );
		var mrow2 = createMathmlElement( 'mrow' );
		mrow1.appendChild( previousSibling );
		var editbox = createEditboxIn( mrow2 );
		mathml.appendChild( mrow1 ); mathml.appendChild( mrow2 );
		range.setStartBefore( inputting );
		range.collapse( true );
		range.insertNode( mathml );
		setCursorIn( editbox );
	}
	
	
	// previousSiblingをmfracの分母にする
	function changePreviousSiblingToDenominator()
	{
		var previousSibling = inputting.previousSibling;
		if ( !previousSibling ) { return; }
		
		var mfrac = createMathmlElement( 'mfrac' );
		var mrow1 = createMathmlElement( 'mrow' );
		var mrow2 = createMathmlElement( 'mrow' );
		var editbox = createEditboxIn( mrow1 );
		mrow2.appendChild( previousSibling );
		mfrac.appendChild( mrow1 ); mfrac.appendChild( mrow2 );
		range.setStartBefore( inputting );
		range.collapse( true );
		range.insertNode( mfrac );
		setCursorIn( editbox );
	}
	
	
	// previousSiblingをmfracの分子にする
	function changePreviousSiblingToNumerator()
	{
		var previousSibling = inputting.previousSibling;
		if ( !previousSibling ) { return; }
		
		var mfrac = createMathmlElement( 'mfrac' );
		var mrow1 = createMathmlElement( 'mrow' );
		var mrow2 = createMathmlElement( 'mrow' );
		mrow1.appendChild( previousSibling );
		var editbox = createEditboxIn( mrow2 );
		mfrac.appendChild( mrow1 ); mfrac.appendChild( mrow2 );
		range.setStartBefore( inputting );
		range.collapse( true );
		range.insertNode( mfrac );
		setCursorIn( editbox );
	}
	
	
	// 変換を確定
	function completeConversion()
	{
		isConverted = false;
		
		if ( !inputting ) { return; }
		if ( inputting.childNodes.length <= 1 ) { return; }
		
		// 候補リストを消す
		if ( useSuggestion ) {
			suggest.hide();
		}
		
		// inputting要素からcursor要素を削除し，中身を抽出してinputting要素の前に出す
		inputting.removeChild( cursor );
		range.selectNodeContents( inputting );
		var fragment = range.extractContents();
		range.setStartBefore( inputting );
		range.collapse( true );
		range.insertNode( fragment );
		
		// inputting要素のスタイルを元に戻し，新しいカーソルを入れる
		inputting.removeAttribute( 'style' );
		inputting.appendChild( cursor );
	}
	
	
	// 文字列をMathMLに変換
	function convertToMathml( str )
	{
		var symbol = Suim.symbol.getSymbol( str );
		
		if ( symbol.input == str ) {
			if ( symbol.output == 'int_{}^{}' ) {
				insertMath( 'integral' );
				return;
			}
			if ( symbol.type == Suim.symbol.ALIAS ) {
				str = symbol.output + Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				symbol = Suim.symbol.getSymbol( str );
			}
			if ( symbol.tag == 'msqrt' ) {
				insertMath( 'sqrt' );
				return;
			}
			else if ( symbol.tag == 'mfrac' ) {
				insertMath( 'frac' );
				return;
			}
			else if ( symbol.type == Suim.symbol.SUPERSCRIPT ) {
				insertMath( 'sup' );
				return;
			}
			else if ( symbol.type == Suim.symbol.SUBSCRIPT ) {
				insertMath( 'sub' );
				return;
			}
			else if ( symbol.type == Suim.symbol.SIMULEQUATIONS ) {
				createTable( 2, 1, '{' );
				return;
			}
			else if ( symbol.type == Suim.symbol.VECTOR ) {
				createTable( 2, 1, '(' );
				return;
			}
			else if ( symbol.type == Suim.symbol.MATRIX ) {
				createTable( 2, 2, '(' );
				return;
			}
		}
		
		var result = parseMath( str );
		if ( !result ) { return; }
		inputting.appendChild( result[ 0 ] );
		inputting.appendChild( cursor );
	}
	
	
	// 変換用のmrow要素を作成
	function createInputtingElement()
	{
		// Safariはdocument.getElementByIdでMathML中のIDを取れない
		if ( Suim.util.searchDescendantById( 'inputting', idocument.body ) ) {
			Suim.util.searchDescendantById( 'inputting', idocument.body ).parentNode.removeChild( inputting );
		}
		if ( Suim.util.searchDescendantById( 'cursor', idocument.body ) ) {
			Suim.util.searchDescendantById( 'cursor', idocument.body ).parentNode.removeChild( cursor );
		}
		
		isConverted = false;
		
		inputting = createMathmlElement( 'mrow' );
		inputting.setAttribute( 'id', 'inputting' );
		cursor = createMathmlElement( 'mspace' );
		cursor.setAttribute( 'id', 'cursor' );
		cursor.setAttribute( 'style',  CURSOR_STYLE );
		cursor.setAttribute( 'width',  CURSOR_WIDTH );
		cursor.setAttribute( 'height', CURSOR_HEIGHT );
		cursor.setAttribute( 'depth',  CURSOR_DEPTH) ;
		inputting.appendChild( cursor );
	}
	
	
	// 指定されたノードの中にエディットボックスを作成する
	function createEditboxIn( node )
	{
		var editbox = createXhtmlElement( 'div' );
		editbox.setAttribute( 'class', 'editbox' );
		editbox.setAttribute( 'style', EDITBOX_STYLE );
		node.appendChild( editbox );
		return editbox;
	}
	
	
	// 括弧要素を作成して，その間にカーソルを移動
	function createFences( left, right )
	{
		var mfenced = createMathmlElement( 'mfenced' );
		var mrow = createMathmlElement( 'mrow' );
		mfenced.setAttribute( 'open', left );
		mfenced.setAttribute( 'close', right );
		mfenced.appendChild( mrow );
		range.setStartBefore( inputting );
		range.collapse( true );
		range.insertNode( mfenced );
		setCursorIn( mrow );
	}
	
	
	// tagNameのMathML要素を作成
	function createMathmlElement( tagName )
	{
		return idocument.createElementNS( 'http://www.w3.org/1998/Math/MathML', tagName );
	}
	
	
	// 子ノードを持ったtagNameのMathML要素を作成
	function createMathmlNode( tagName, child ) {
		var node = idocument.createElementNS( 'http://www.w3.org/1998/Math/MathML', tagName );
		if ( typeof child == 'string' ) {
			node.appendChild( idocument.createTextNode( child ) );
		}
		else {
			node.appendChild( child );
		}
		return node;
	}
	
	
	// 新しいmath要素を追加する
	function createNewMathElement( node )
	{
		var math = createMathmlElement( 'math' );
		var mstyle = createMathmlElement( 'mstyle' );
		math.setAttribute( 'xmlns', 'http://www.w3.org/1998/Math/MathML' );
		if ( enableChangeMode ) {
			math.setAttribute( 'display', 'inline' );
			math.setAttribute( 'style', 'display:inline;' );
		}
		else {
			math.setAttribute( 'display', 'block' );
			math.setAttribute( 'style', MATH_STYLE );
		}
		mstyle.setAttribute( 'displaystyle', DISPLAYSTYLE );
		mstyle.setAttribute( 'style' , MSTYLE_STYLE );
		math.appendChild( mstyle );
		
/*
		Suim.util.addEventListener( math, 'contextmenu', function ( event ) {
			// [TODO] copy, delelte, searchなど実装予定
			event.preventDefault();
			alert( getXML() );
		} );
*/
		
		return math;
	}
	
	
	// 候補提示用オブジェクトを作成
	function createSuggestObject()
	{
		suggest = new Object();
		suggest.box = document.createElement( 'div' );
		suggest.box.style.position = 'absolute';
		suggest.box.style.backgroundColor = '#FBFFFF';
		suggest.box.style.width = '120px';
		suggest.box.style.overflow = 'auto';
		suggest.box.style.border = '1px solid #BEC7E4';
		suggest.box.style.display = 'none';
		suggest.box.style.marginTop = '16pt';
		suggest.box.style.MozBoxShadow = '1px 1px 1px #98A4B0';
		suggest.box.style.borderRadius = '5px';
		suggest.box.style.MozBorderRadius = '5px';
		suggest.box.style.WebkitBorderRadius = '5px';
		document.body.appendChild( suggest.box )
		
		suggest.selected = -1;
		
		suggest.list = [];
		
		suggest.hide = function ()
		{
			suggest.box.style.display = 'none';
		};
		
		suggest.moveDown = function ()
		{
			if ( suggest.box.style.display != 'none'  ) {
				if ( suggest.selected < suggest.box.childNodes.length - 1 ) {
					if ( suggest.selected >= 0  ) {
						suggest.box.childNodes[ suggest.selected ].style.backgroundColor = '';
					}
					suggest.selected += 1;
					suggest.box.childNodes[ suggest.selected ].style.backgroundColor = SELECTED_COLOR;
				}
				else if ( suggest.selected == suggest.box.childNodes.length - 1 ) {
					suggest.box.childNodes[ suggest.box.childNodes.length - 1 ].style.backgroundColor = '';
					suggest.selected = 0;
					suggest.box.childNodes[ suggest.selected ].style.backgroundColor = SELECTED_COLOR;
				}
				range.selectNodeContents( inputting );
				range.deleteContents();
				var s = suggest.list[ suggest.selected ]
				for ( var i = 0; i < s.length; i++ ) {
					var mi = createMathmlNode( 'mi', s.slice( i, i + 1 ) );
					inputting.appendChild( mi );
				}
				inputting.appendChild( cursor );
			}
		};
		
		suggest.moveUp = function ()
		{
			if ( suggest.box.style.display != 'none' ) {
				if ( suggest.selected > 0 && suggest.selected < suggest.box.childNodes.length ) {
					suggest.box.childNodes[ suggest.selected ].style.backgroundColor = '';
					suggest.selected -= 1;
					suggest.box.childNodes[ suggest.selected ].style.backgroundColor = SELECTED_COLOR;
				}
				else if ( suggest.selected == 0 ) {
					suggest.box.childNodes[ 0 ].style.backgroundColor = '';
					suggest.selected = suggest.box.childNodes.length - 1;
					suggest.box.childNodes[ suggest.selected ].style.backgroundColor = SELECTED_COLOR;
				}
				range.selectNodeContents( inputting );
				range.deleteContents();
				var s = suggest.list[ suggest.selected ]
				for ( var i = 0; i < s.length; i++ ) {
					var mi = createMathmlNode( 'mi', s.slice( i, i + 1 ) );
					inputting.appendChild( mi );
				}
				inputting.appendChild( cursor );
			}
		};
		
		suggest.insert = function ()
		{
			suggest.hide();
			range.selectNodeContents( inputting );
			range.deleteContents();
			convertToMathml( suggest.list[ suggest.selected ] );
			completeConversion();
			suggest.selected = -1;
		};
		
		suggest.select = function ( number )
		{
			if ( suggest.selected != -1 ) {
				suggest.box.childNodes[ suggest.selected ].style.backgroundColor = '';
			}
			suggest.selected = number;
			suggest.box.childNodes[ suggest.selected ].style.backgroundColor = SELECTED_COLOR;
		};
		
		suggest.update = function ( str )
		{
			suggest.selected = -1;
			suggest.list = [];
			suggest.box.innerHTML = '';
			var position = iframe.getBoundingClientRect();
			var iposition = inputting.getBoundingClientRect();
			suggest.box.style.top = Math.round( window.scrollY + position.top + iposition.top ) + 'px';
			suggest.box.style.left = Math.round( window.scrollX + position.left + iposition.left ) + 'px';
			var symbols = Suim.symbol.getSubsequentSymbols( str );
			suggest.box.style.display = 'block';
			var i = 0;
			for ( key in symbols ) {
				suggest.list.push( symbols[ key ] );
				var div = document.createElement( 'div' );
				Suim.util.addEventListener( div, 'mouseover', function ( event ) {
					var node = event.target;
					while ( node.parentNode != suggest.box ) {
						node = node.parentNode;
					}
					suggest.select( Suim.util.getNodeNumber( node ) );
				});
				Suim.util.addEventListener( div, 'click', function () {
					suggest.insert();
					suggest.selected = -1;
					iwindow.focus();
				});
				div.style.fontSize = '12pt';
				div.style.padding = '3px 5px';
				var math = document.createElementNS( 'http://www.w3.org/1998/Math/MathML', 'math' );
				var mstyle = document.createElementNS( 'http://www.w3.org/1998/Math/MathML', 'mstyle' );
				math.setAttribute( 'xmlns', 'http://www.w3.org/1998/Math/MathML' );
				div.appendChild( math );
				math.appendChild( mstyle );
				mstyle.appendChild( parseMath( symbols[ key ] )[ 0 ] );
				var span = document.createElement( 'span' );
				span.innerHTML = ' (' + symbols[ key ] + ')';
				span.setAttribute( 'style', 'font-size:0.8em; font-family:"Lucida Grande",Verdana,Arial,sans-serif' );
				div.appendChild( span );
				suggest.box.appendChild( div );
				i++;
			}
			if ( i == 0 ) {
				suggest.hide();
			}
		};
	}
	
	
	// TableElementを作成
	function createTable( row, column, fence )
	{
		var mtable = createMathmlElement( 'mtable' );
		
		var i, j;
		var mtr = new Array( row );
		var mtd = new Array( row );
		var box = new Array( row );
		for ( i = 0; i < row; i++ ) {
			mtd[i] = new Array( column );
			box[i] = new Array( column );
		}
		
		for ( i = 0; i < row; i++ ) {
			mtr[ i ] = createMathmlElement( 'mtr' );
			for ( j = 0; j < column; j++ ) {
				mtd[i][j] = createMathmlElement( 'mtd' );
				box[i][j] = createXhtmlElement( 'div' );
				box[i][j].setAttribute( 'class' , 'editbox' );
				box[i][j].setAttribute( 'style', EDITBOX_STYLE );
				mtd[i][j].appendChild( box[i][j] );
				mtr[i].appendChild( mtd[i][j] );
			}
			mtable.appendChild( mtr[i] );
		}
		
		var mfenced = createMathmlElement( 'mfenced' );
		if ( fence == '(' ) {
			mfenced.setAttribute( 'open', '(' );
			mfenced.setAttribute( 'close', ')' );
		}
		else if ( fence == '[' ) {
			mfenced.setAttribute( 'open', '[' );
			mfenced.setAttribute( 'close', ']' );
		}
		else if ( fence == '|' ) {
			mfenced.setAttribute( 'open', '|' );
			mfenced.setAttribute( 'close', '|' );
		}
		else if ( fence == '{' ) {
			mfenced.setAttribute( 'open', '{' );
			mfenced.setAttribute( 'close', '' );
			mtable.setAttribute( 'columnalign', 'left' );
		}
		
		mfenced.appendChild( mtable );
		
		if ( inputting.parentNode.getAttribute( 'class' ) == 'editbox' ) {
			inputting.parentNode.parentNode.replaceChild( mfenced, inputting.parentNode );
		}
		else {
			inputting.parentNode.replaceChild( mfenced, inputting );
		}
		
		setCursorIn( box[ 0 ][ 0 ] );
		
		iwindow.focus();
	}
	
	
	// ツールバーの中のボタンを作成
	function createToolElement( target, title, imageFile, onClickHandler )
	{
		var button = document.createElement( 'img' );
		button.setAttribute( 'src', IMAGES_DIR + imageFile );
		button.setAttribute( 'title', title );
		button.setAttribute( 'style', 'background-color:#FCFCFC; margin:5px; border:solid 2px #FCFCFC; -moz-border-radius: 2px;' );
		Suim.util.addEventListener( button, 'click', onClickHandler );
		Suim.util.addEventListener( button, 'mouseover', function () {
			button.style.border = 'solid 2px #CCCCCC';
		} );
		Suim.util.addEventListener( button, 'mouseout', function () {
			button.setAttribute( 'src', IMAGES_DIR + imageFile );
			button.style.border = 'solid 2px #FCFCFC';
		} );
		Suim.util.addEventListener( button, 'contextmenu', function ( event ) {
			event.preventDefault();
		} );
		Suim.util.addEventListener( button, 'dragstart', function ( event ) {
			event.preventDefault();
		} );
		target.appendChild( button );
		return button;
	}
	
	
	// tagNameのXHTML要素を作成
	function createXhtmlElement( tagName ) {
		return idocument.createElementNS( 'http://www.w3.org/1999/xhtml' , tagName );
	}
	
	
	// 文字を削除
	function deleteCharacter()
	{
		// エディットボックスの中の場合
		if ( inputting.parentNode.getAttribute( 'class' ) == 'editbox' ) {
			var element = inputting.parentNode.parentNode.parentNode;
			if ( element.nodeName == 'msub' || element.nodeName == 'msup' || element.nodeName == 'munder' || element.nodeName == 'mover' || element.nodeName == 'mfrac' ) {
				if ( Suim.util.getNodeNumber( inputting.parentNode.parentNode ) == 1 ) {
					range.selectNodeContents( element.childNodes[ 0 ] );
					var fragment = range.extractContents();
					setCursorAfter( element );
					range.setStartBefore( element );
					range.collapse( true );
					range.insertNode( fragment );
					range.selectNode( element );
					range.deleteContents();
					return;
				}
			}
			if ( inputting.parentNode.parentNode.nodeName != 'mtd' ) {
				if ( !selectedNodes ) {
					selectedNodes = inputting.parentNode.parentNode.parentNode;
					selectedNodes.setAttribute( 'style', SELECTED_STYLE );
					stopBlinking();
					return;
				}
			}
			else {
				return;
			}
		}
		
		// 入力途中ではないとき
		if ( inputting.childNodes.length == 1 ) {
			
			// pereviousSiblingがある場合
			if ( inputting.previousSibling ) {
				
				// previousSiblingがmrowなどの固まりの場合，一度削除される部分を確認させる
				if ( inputting.previousSibling.nodeName in BINARY_ELEMENT
				  || inputting.previousSibling.nodeName in TRINARY_ELEMENT
				  || inputting.previousSibling.nodeName == 'msqrt'
				  || inputting.previousSibling.nodeName == 'mrow' ) {
					if ( !selectedNodes ) {
						inputting.previousSibling.setAttribute( 'style', SELECTED_STYLE );
						selectedNodes = inputting.previousSibling;
						stopBlinking();
						return;
					}
				}
				
				// previousSiblingがmfencedの場合
				if ( inputting.previousSibling.nodeName == 'mfenced' ) {
					// mtableのとき
					if ( inputting.previousSibling.firstChild.nodeName == 'mtable' ) {
						if ( !selectedNodes ) {
							inputting.previousSibling.setAttribute( 'style', SELECTED_STYLE );
							selectedNodes = inputting.previousSibling;
							stopBlinking();
							return;
						}
					}
					else {
						// 左括弧をただのmoにする
						var mfenced = inputting.previousSibling;
						range.selectNodeContents( mfenced.firstChild );
						var node = range.extractContents();
						var left = createMathmlElement( 'mo' );
						left.appendChild( idocument.createTextNode( mfenced.getAttribute( 'open' ) ) );
						range.setStartAfter( mfenced );
						range.collapse( true );
						range.insertNode( node );
						range.insertNode( left );
						range.selectNode( mfenced );
						range.deleteContents();
						return;
					}
				}
				
				// 選択オブジェクトがあれば，それを，なければpreviousSiblingを消す
				if ( selectedNodes ) {
					range.selectNode( selectedNodes );
					selectedNodes = null;
				} else {
					range.selectNode( inputting.previousSibling );
				}
				range.deleteContents();
				
				// 前を消したことで，親要素の子ががなくなった場合
				if ( inputting.parentNode.childNodes.length == 1 ) {
					// frac等のmrowの中身がなくなったのなら，エディットボックスを付加
					if ( inputting.parentNode.parentNode ) {
						if ( inputting.parentNode.parentNode.nodeName in BINARY_ELEMENT
						  || inputting.parentNode.parentNode.nodeName in TRINARY_ELEMENT
						  || inputting.parentNode.parentNode.nodeName == 'msqrt'
						  || inputting.parentNode.nodeName == 'mtd' ) {
							var editbox = createEditboxIn( inputting.parentNode );
							setCursorIn( editbox );
						}
					}
				}
			}
			
			// previousSiblingがない場合
			else {
				
				// 選択オブジェクトがあればそれを消す
				if ( selectedNodes ) {
					setCursorAfter( selectedNodes );
					range.selectNode( selectedNodes );
					selectedNodes = null;
					range.deleteContents();
					// 消したことで，親要素の子ががなくなった場合
					if ( inputting.parentNode.childNodes.length == 1 ) {
						// frac等のmrowの中身がなくなったのなら，エディットボックスを付加
						if ( inputting.parentNode.parentNode ) {
							if ( inputting.parentNode.parentNode.nodeName in BINARY_ELEMENT
							  || inputting.parentNode.parentNode.nodeName in TRINARY_ELEMENT
							  || inputting.parentNode.parentNode.nodeName == 'msqrt'
							  || inputting.parentNode.nodeName == 'mtd' ) {
								var editbox = createEditboxIn( inputting.parentNode );
								setCursorIn( editbox );
							}
						}
					}
					return;
				}
				
				// ２行目以降のmath要素の削除
				if ( inputting.parentNode.nodeName == 'mstyle' ) {
					
					var math = inputting.parentNode.parentNode;
					
					if ( inputting.parentNode.childNodes.length == 1 ) {
						
						// 2行から1行になるとき，divをspanに
						if ( enableChangeMode && Suim.util.getNodeNumber( math ) == 1 && math.parentNode.childNodes.length == 2 ) {
							var previousMath = math.previousSibling;
							previousMath.setAttribute( 'display', 'inline' );
							previousMath.setAttribute( 'style', 'display:inline;' );
							var div = previousMath.parentNode;
							range.selectNodeContents( div );
							var contents = range.extractContents();
							var span = idocument.createElement( 'span' );
							span.setAttribute( 'class', 'math' );
							span.setAttribute( 'style', MATH_SPAN_STYLE );
							span.appendChild( contents );
							div.parentNode.replaceChild( span, div );
							math.parentNode.removeChild( math );
							setCursorIn( previousMath.firstChild );
							return;
						}
						
						// 行の削除
						if ( Suim.util.getNodeNumber( math ) > 0 ) {
							var mstyle = math.previousSibling.firstChild;
							math.parentNode.removeChild( math );
							setCursorIn( mstyle );
							return;
						}
						
						// モード切り替え
						if ( Suim.util.getNodeNumber( math ) == 0 && math.parentNode.previousSibling ) {
							switchMathMode( 'off' );
							return;
						}
						
						else {
							return;
						}
					}
					else {
						// 上の行とマージ
						if ( Suim.util.getNodeNumber( math ) > 0 ) {
							range.selectNodeContents( inputting.parentNode );
							var fragment = range.extractContents();
							range.setStartAfter( math.previousSibling.firstChild.lastChild );
							range.collapse( true );
							range.insertNode( fragment );
							range.selectNode( math );
							range.deleteContents();
							return;
						}
					}
				}
				
				// 左括弧が左にあるとき，右括弧をただのmoにする
				if ( inputting.parentNode.parentNode.nodeName == 'mfenced') {
					var mfenced = inputting.parentNode.parentNode;
					range.selectNodeContents( mfenced.firstChild );
					var contents = range.extractContents();
					range.setStartAfter( mfenced );
					range.collapse( true );
					var right = createMathmlElement( 'mo' );
					right.appendChild( idocument.createTextNode( mfenced.getAttribute( 'close' ) ) );
					range.insertNode( right );
					range.insertNode( contents );
					mfenced.parentNode.removeChild( mfenced );
				}
				
				// mfracなどの中のmrow（sinなど）の中でmrowが空になったとき
				if ( inputting.parentNode.childNodes.length == 1 ) {
					var target = inputting.parentNode;
					setCursorBefore( target );
					range.selectNode( target );
					range.deleteContents();
					if ( inputting.parentNode.parentNode.nodeName in BINARY_ELEMENT
					  || inputting.parentNode.parentNode.nodeName in TRINARY_ELEMENT
					  || inputting.parentNode.parentNode.nodeName == 'msqrt'
					  || inputting.parentNode.parentNode.nodeName == 'mtd' ) {
						var editbox = createEditboxIn( inputting.parentNode );
						setCursorIn( editbox );
					}
					deleteCharacter();
					return;
				}
			}
		}
		
		// 入力途中の場合
		else if ( inputting.childNodes.length > 1 ) {
			if ( cursor.previousSibling ) {
				range.selectNode( cursor.previousSibling );
				range.deleteContents();
				
				// 候補を更新
				if ( useSuggestion ) {
					if ( inputting.childNodes.length > SUGGEST_LENGTH ) {
						suggest.update( Suim.util.extractText( inputting ) );
					}
					else if ( inputting.childNodes.length <= SUGGEST_LENGTH ) {
						suggest.hide();
					}
				}
				
				// inputting要素の中がcursor要素だけになったら，下線スタイルを外す
				if ( inputting.childNodes.length == 1 ) {
					inputting.removeAttribute( 'style' );
					
					// 前を消したことで，親要素の子ががなくなった場合
					if ( inputting.parentNode.childNodes.length == 1 ) {
						// frac等のmrowの中身がなくなったのなら，エディットボックスを付加
						if ( inputting.parentNode.parentNode ) {
							if ( inputting.parentNode.parentNode.nodeName in BINARY_ELEMENT
							  || inputting.parentNode.parentNode.nodeName in TRINARY_ELEMENT
							  || inputting.parentNode.parentNode.nodeName == 'msqrt'
							  || inputting.parentNode.nodeName == 'mtd' ) {
								var editbox = createEditboxIn( inputting.parentNode );
								setCursorIn( editbox );
							}
						}
					}
				}
			}
		}
		
		if ( inputting.parentNode.nodeName == 'mrow' ) {
			currentGroup = inputting.parentNode;
			currentGroup.setAttribute( 'style', GROUP_STYLE );
		}
	}
	
	
	// XSLファイルを非同期にダウンロードしてXSLTProcessorにセット
	function downloadXsltFile( asynchronous )
	{
		if ( Suim.xslt ) { return; }
		
		var request = new XMLHttpRequest();
		request.open( 'GET', XSLT_FILE, asynchronous );
		request.send( null );
		if ( asynchronous ) {
			request.onreadystatechange = function ()
			{
				if ( request.readyState == 4 && request.status == 200 ) {
					var xsl = request.responseXML;
					Suim.xslt = new XSLTProcessor();
					Suim.xslt.importStylesheet( xsl );
				}
			}
		}
		else {
			var xsl = request.responseXML;
			Suim.xslt = new XSLTProcessor();
			Suim.xslt.importStylesheet( xsl );
		}
	}
	
	
	// designModeのコマンドを実行
	function execCommand( command, argument ){
		idocument.execCommand( command, false, argument );
		iwindow.focus();
	}
	
	
	// idocument.bodyの中にある内容を返す
	function getData()
	{
		var fragment;
		
		Suim.util.removeMozillaAttribute( idocument.body );
		
		if ( isMathMode ) {
			
			// 現在の数式を決定
			completeConversion();
			
			var parentNode = inputting.parentNode;
			
			// inputting要素を削除
			if ( parentNode ) {
				parentNode.removeChild( inputting );
			}
			
			// スタイル除去
			if ( selectedNodes ) {
				selectedNodes.removeAttribute( 'style' );
				selectedNodes = null;
			}
			if ( currentGroup ) {
				currentGroup.removeAttribute( 'style' );
				currentGroup = null;
			}
			
			// bodyの内容をコピー
			range.selectNodeContents( idocument.body );
			fragment = range.cloneContents();
			
			if ( parentNode ) {
				setCursorIn( parentNode );
				stopBlinking();
			}
		}
		else {
			// bodyの内容をコピー
			range.selectNodeContents( idocument.body );
			fragment = range.cloneContents();
		}
		
		return fragment;
	}
	
	
	// document取得
	function getDocument()
	{
		var contentDocument;
		if ( iframe.contentDocument ) {
			contentDocument = iframe.contentDocument;
		}
		else {
			contentDocument = getWindow().document;
		}
		return contentDocument;
	}
	
	
	// MathMLコード取得
	function getMathML( mathTag )
	{
		if ( isMathMode ) {
			
			// 現在の数式を決定
			completeConversion();
			
			// inputting要素を削除
			var parentNode = inputting.parentNode;
			parentNode.removeChild( inputting );
			
			// スタイル除去
			if ( selectedNodes ) {
				selectedNodes.removeAttribute( 'style' );
				selectedNodes = null;
			}
			if ( currentGroup ) {
				currentGroup.removeAttribute( 'style' );
				currentGroup = null;
			}
		}
		
		var serializer = new XMLSerializer();
		
		var mathNodes = idocument.getElementsByClassName( 'math' );
		var mathml = '';
		
		for ( var i = 0; i < mathNodes.length; i++ ) {
			for ( var j = 0; j < mathNodes[ i ].childNodes.length; j++ ) {
				if ( mathTag == false ) {
					range.selectNodeContents( mathNodes[ i ].childNodes[ j ].firstChild );
					mathml += serializer.serializeToString( range.cloneContents() );
					mathml = mathml.replace( / xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/gi, '' );
				}
				else {
					var mathStyle = mathNodes[ i ].childNodes[ j ].getAttribute( 'style' );
					var MSTYLE_STYLE = mathNodes[ i ].childNodes[ j ].firstChild.getAttribute( 'style' );
					mathNodes[ i ].childNodes[ j ].removeAttribute( 'style' );
					mathNodes[ i ].childNodes[ j ].firstChild.removeAttribute( 'style' );
					range.selectNode( mathNodes[ i ].childNodes[ j ] );
					mathml += serializer.serializeToString( range.cloneContents() );
					mathNodes[ i ].childNodes[ j ].setAttribute( 'style', mathStyle );
					mathNodes[ i ].childNodes[ j ].firstChild.setAttribute( 'style', MSTYLE_STYLE );
				}
			}
		}
		
		if ( isMathMode ) {
			setCursorIn( parentNode );
			stopBlinking();
		}
		
		return mathml;
	}
	
	
	// DOM Range取得
	function getRange()
	{
		var range;
		var selection = getSelection();
		if ( selection.rangeCount > 0 ) {
			range = selection.getRangeAt( 0 );
		}
		else if ( idocument.createRange ) {
			range = idocument.createRange();
		}
		else {
			range = selection.createRange();
		}
		return range;
	}
	
	
	// DOM Selction取得
	function getSelection()
	{
		var selection;
		if ( iwindow.getSelection && iwindow.getSelection() ) {
			selection = iwindow.getSelection();
		}
		else if ( idocument.getSelection ) {
			selection = idocument.getSelection();
		}
		else if ( idocument.selection ) {
			selection = idocument.selection;
		}
		return selection;
	}
	
	
	// LaTeXコードを取得
	function getTeX()
	{
		if ( !Suim.xslt ) {
			downloadXsltFile( false );
		}
		var xml = getXML();
		var parser = new DOMParser();
		xml = '<body>' + xml + '</body>';
		xml = parser.parseFromString( xml, 'text/xml' );
		var fragment = Suim.xslt.transformToFragment( xml, document );
		var latex = fragment.firstChild.nodeValue;
		latex = latex.replace( /&/g, '&amp;' );
		latex = latex.replace( /</g, '&lt;' );
		latex = latex.replace( />/g, '&gt;' );
		return latex;
	}
	
	
	// iframeのcontentWindow取得
	function getWindow()
	{
		var contentWindow;
		if ( iframe.contentWindow ) {
			contentWindow = iframe.contentWindow;
		}
		return contentWindow;
	}
	
	
	// XMLコード取得
	function getXML()
	{
		var data = getData();
		
		if ( !data ) {
			return 'No Data!';
		}
		
		var serializer = new XMLSerializer();
		var xml = serializer.serializeToString( data );
		xml = xml.replace( /\r\n/g, '' );
		xml = xml.replace( /\n/g, '' );
		xml = xml.replace( /\t/g, '' );
		xml = xml.replace( /\\/g, '\\\\' );
		xml = xml.replace( /<\/?\s*\w+/g, function ( m ) { return m.toLowerCase(); } );
		xml = xml.replace( /<br>/gi, '<br/>' );
		xml = xml.replace( /<script.*<\/script>/gi, '' );
		xml = xml.replace( /<style.*<\/style>/gi, '' );
		xml = xml.replace( /<form.*<\/form>/gi, '' );
		xml = xml.replace( / type="_moz"/gi, '' );
		xml = xml.replace( / _moz_editor_bogus_node="TRUE"/gi, '' );
		xml = xml.replace( / xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/gi, '' );
		xml = xml.replace( / xmlns=""/gi, '' );
		return xml;
	}
	
	
	// 現在のinputting要素が，tagNameの要素の子孫であるか
	function isIn( tagName )
	{
		if ( Suim.util.searchAncestorByTagName( tagName, inputting ) ) {
			return true;
		}
		else {
			return false;
		}
	}
	
	
	// ツールバーを隠す
	function hideToolbar()
	{
		if ( document.getElementById( id + '_toolbar' ) ) {
			document.getElementById( id + '_toolbar' ).style.display = 'none';
			document.getElementById( id + '_toolbar_phantom' ).style.display = 'none';
		}
	}
	
	
	// 初期化
	function initialize()
	{
		// 動作環境の確認
/*
		if ( !Suim.browser.isFF() ) {
			var div = document.getElementById( id );
			div.style.position = 'relative';
			var html = '<div style="text-align:center; font-size:small; position:absolute; top:50%; width:100%; margin-top:-1.5em; font-weight:bold; color:rgb(75, 71, 66);">';
			html += 'Sorry, your browser is not supported yet.<br/>';
			html += 'Please use <a href="http://www.mozilla.com/en-US/" style="color:rgb(4, 137, 183);">Firefox</a> (It\'s FREE!) to try Suim.</div>';
			div.innerHTML = html;
			return;
		}
*/
		
		setConfig( config );
		setIframe();
		setEventListener();
		
		if ( downloadXSL ) {
			downloadXsltFile( true );
		}
		
		if ( enableChangeMode ) {
			switchDesignMode( 'on' );
			isMathMode = false;
			window.focus();
/*
			if ( Suim.browser.isFF() ) { // p要素を作成（最初にデリートキーを押されると消えてしまう）
				idocument.execCommand( 'insertParagraph', false, null );
			}
*/
		}
		else {
			var div = idocument.createElement( 'div' );
			var math = createNewMathElement();
			div.setAttribute( 'class', 'math' );
			div.appendChild( math );
			idocument.body.appendChild( div );
			setCursorIn( math.firstChild );
			isMathMode = true;
			stopBlinking();
		}
		
		if ( useToolbar ) {
			attachToolbar();
		}
		
		if ( useSuggestion ) {
			createSuggestObject();
		}
	}
	
	
	// 様々なMathMLノードを挿入する
	function insertMath( name )
	{
		completeConversion();
		if ( selectedNodes ) {
			selectedNodes.removeAttribute( 'style' );
			selectedNodes = null;
		}
		
		// もしエディットボックスがあったら消す
		if ( inputting.parentNode.getAttribute( 'class' ) == 'editbox' ) {
			var target = inputting.parentNode.parentNode;
			target.removeChild( inputting.parentNode );
			setCursorIn( target );
		}
		 
		switch ( name ) {
			
			case 'sqrt':
				var msqrt = createMathmlElement( 'msqrt' );
				var mrow = createMathmlElement( 'mrow' );
				msqrt.appendChild( mrow );
				var editbox = createEditboxIn( mrow );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( msqrt );
				setCursorIn( editbox );
				break;
			
			case 'frac':
				var mfrac = createMathmlElement( 'mfrac' );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				var editbox = createEditboxIn( mrow1 ); createEditboxIn( mrow2 );
				mfrac.appendChild( mrow1 ); mfrac.appendChild( mrow2 );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( mfrac );
				setCursorIn( editbox );
				break;
				
			case 'sup':
				var msup = createMathmlElement( 'msup' );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				var editbox = createEditboxIn( mrow1 ); createEditboxIn( mrow2 );
				msup.appendChild( mrow1 ); msup.appendChild( mrow2 );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( msup );
				setCursorIn( editbox );
				break;
			
			case 'sub':
				var msub = createMathmlElement( 'msub' );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				var editbox = createEditboxIn( mrow1 ); createEditboxIn( mrow2 );
				msub.appendChild( mrow1 ); msub.appendChild( mrow2 );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( msub );
				setCursorIn( editbox );
				break;
				
			case 'integral':
				var msubsup = createMathmlElement( 'msubsup' );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				var mrow3 = createMathmlElement( 'mrow' );
				msubsup.appendChild( mrow1 ); msubsup.appendChild( mrow2 ); msubsup.appendChild( mrow3 );
				var mo = createMathmlElement( 'mo' );
				mo.appendChild( idocument.createTextNode( '\u222B' ) );
				mrow1.appendChild( mo );
				var editbox = createEditboxIn( mrow2 ); createEditboxIn( mrow3 );
				range.setStartBefore( inputting );
				range.collapse( true );
				range.insertNode( msubsup );
				setCursorIn( editbox );
				break;
		}
		
		iwindow.focus();
	}
	
	
	// 特定の位置にNodeを挿入
	function insertNodeAtSelection( insertNode )
	{
		var range = getRange();
		
		var container = range.startContainer;
		var offset = range.startOffset;
		
		if ( container.nodeType == container.TEXT_NODE && insertNode.nodeType == insertNode.TEXT_NODE ) {
			container.insertData( offset, insertNode.data );
			range.setEnd( container, offset + insertNode.length );
			range.setStart( container, offset + insertNode.length );
		} 
		else {
			var afterNode;
			var beforeNode;
			if ( container.nodeType == container.TEXT_NODE ) {
				var textNode = container;
				var parentNode = textNode.parentNode;
				var text = textNode.nodeValue;
				
				var textBefore = text.substr( 0, offset );
				var textAfter = text.substr( offset );
				
				beforeNode = idocument.createTextNode( textBefore );
				afterNode = idocument.createTextNode( textAfter );
				
				parentNode.insertBefore( afterNode, textNode );
				parentNode.insertBefore( insertNode, afterNode );
				parentNode.insertBefore( beforeNode, insertNode );
				
				parentNode.removeChild( textNode );
			} 
			else {
				if ( container.childNodes[ offset ] ) {
					afterNode = container.childNodes[ offset ];
					container.insertBefore( insertNode, afterNode );
				}
				else {
					afterNode = idocument.createTextNode( '' );
					container.appendChild( afterNode );
					container.insertBefore( insertNode, afterNode );
				}
			}
			
			range.setEnd( afterNode, 0 );
			range.setStart( afterNode, 0 );
		}
	}
	
	
	// MathMLをSuimのiframeに読み込む
	function loadMathML( mathml )
	{
		if ( !isMathMode ) {
			switchMathMode( 'on' );
		}
		
		// データクリア
		range.selectNodeContents( idocument.body );
		range.deleteContents();
		
		var mathTree = parseMathML( mathml );
		
		var div = idocument.createElement( 'div' );
		div.setAttribute( 'class', 'math' );
		div.appendChild( mathTree );
		idocument.body.appendChild( div );
		
		setCursorIn( div.lastChild.firstChild );
		window.focus();
		iwindow.focus();
	}
	
	
	// XMLをSuimのiframeに読み込む
	function loadXML( xml )
	{
		// データクリア
		range.selectNodeContents( idocument.body );
		range.deleteContents();
		
		var data = parseXML( xml );
		idocument.body.appendChild( data );
	}
	
	
	// カーソルを下に移動
	function moveDown()
	{
		if ( inputting.childNodes.length == 1 )
		{
			// msubなどのとき，1番目のノードにいたら2番目のノードに移動する
			if ( isIn( 'mfrac' ) || isIn( 'msub' ) || isIn( 'munder' ) || isIn( 'msubsup' ) || isIn( 'munderover' ) ) {
				var mrow = Suim.util.searchAncestorByTagName( 'mrow', inputting );
				if ( mrow.parentNode.nodeName in { 'mfrac':1, 'msub':1, 'munder':1, 'msubsup':1, 'munderover':1 } ) {
					var n = Suim.util.getNodeNumber( mrow );
					if ( n == 0 ) {
						setCursorIn( mrow.parentNode.childNodes[ 1 ] );
						return;
					}
				}
			}
			
			// msupなどのとき，2番目のノードにいたら1番目のノードに移動する
			if ( isIn( 'msup' ) || isIn( 'mover' ) ) {
				var mrow = Suim.util.searchAncestorByTagName( 'mrow', inputting );
				if ( mrow.parentNode.nodeName in { 'msup':1, 'mover':1 } ) {
					var n = Suim.util.getNodeNumber( mrow );
					if ( n == 1 ) {
						setCursorIn( mrow.parentNode.childNodes[ 0 ] );
						return;
					}
				}
			}
			
			// msubsupなどのとき，3番目のノードにいたら1番目のノードに移動する
			if ( isIn( 'msubsup' ) || isIn( 'munderover' ) ) {
				var mrow = Suim.util.searchAncestorByTagName( 'mrow', inputting );
				if ( mrow.parentNode.nodeName in { 'msubsup':1, 'munderover':1 } ) {
					var n = Suim.util.getNodeNumber( mrow );
					if ( n == 2 ) {
						setCursorIn( mrow.parentNode.childNodes[ 0 ] );
						return;
					}
				}
			}
			
			// 行列要素の中の場合
			if ( isIn( 'mtable' ) ) {
				var mtd = Suim.util.searchAncestorByTagName( 'mtd', inputting );
				var mtr = mtd.parentNode;
				var i = Suim.util.getNodeNumber( mtr ) + 1;
				var j = Suim.util.getNodeNumber( mtd ) + 1;
				var target;
				if ( i < mtr.parentNode.childNodes.length ) {
					setCursorIn( mtr.nextSibling.childNodes[ j - 1 ] );
					return;
				}
			}
			
			var math = Suim.util.searchAncestorByTagName( 'math', inputting );
			
			// 最下行のとき
			if ( Suim.util.getNodeNumber( math ) == math.parentNode.childNodes.length - 1 ) {
				// 行の終わりのとき
				if ( !inputting.nextSibling && inputting.parentNode.nodeName == 'mstyle' ) {
					if ( math.parentNode.nextSibling ) {
						switchMathMode( 'off' );
					}
				}
				else {
					setCursorIn( math.firstChild );
				}
			}
			
			// 下の行があれば下の行の一番前にカーソル移動
			else {
				if ( math.nextSibling.firstChild.firstChild ) {
					setCursorBefore( math.nextSibling.firstChild.firstChild );
				}
				else {
					setCursorIn( math.nextSibling.firstChild );
				}
			}
		}
		// 入力途中の場合
		else {
			// 候補リスト内を移動
			if ( useSuggestion ) {
				suggest.moveDown();
			}
		}
	}
	
	
	// カーソルを左に移動
	function moveLeft()
	{
		if ( isConverted ) { return; }
		
		// 入力途中（INPUTTING_STYLEのとき）
		if ( inputting.childNodes.length > 1 ) {
			if ( cursor.previousSibling ) {
				range.setStartBefore( cursor.previousSibling );
				range.collapse( true );
				range.insertNode(cursor);
			}
			else {
				if ( inputting.previousSibling ) {
					var previousSibling = inputting.previousSibling;
					completeConversion();
					setCursorAfter( previousSibling );
				}
				else {
					completeConversion();
					setCursorBefore( inputting.parentNode.firstChild );
				}
			}
			return;
		}
		
		// 行列要素の中の場合
		if ( isIn( 'mtable' ) && !inputting.previousSibling && inputting.parentNode.nodeName == 'mtd' ) {
			var mrow = Suim.util.searchAncestorByTagName( 'mtable', inputting ).parentNode;
			var mtr = inputting.parentNode.parentNode;
			var mtd = inputting.parentNode;
			var i = Suim.util.getNodeNumber( mtr ) + 1;
			var j = Suim.util.getNodeNumber( mtd ) + 1;
			var target;
			if ( i == 1 && j == 1 ) {
				setCursorBefore( mrow );
				return;
			}
			else if ( j == 1 ) {
				var target = mtr.previousSibling.lastChild;
			}
			else {
				var target = mtd.previousSibling;
			}
			setCursorIn( target );
			return;
		}
		
		var previousSibling = inputting.previousSibling;
		
		// previousSiblingがあるとき
		if ( previousSibling ) {
			
			// previousSiblingが2つのパラメータを取る要素（mfrac, msubなど）のとき
			if ( previousSibling.nodeName in BINARY_ELEMENT ) {
				// ちゃんと全部<mrow>に入っていれば，2つ目の要素の中にカーソルを移動する
				if ( previousSibling.childNodes[ 0 ].nodeName == 'mrow'
				  && previousSibling.childNodes[ 1 ].nodeName == 'mrow' ) {
					setCursorIn( previousSibling.childNodes[ 1 ] );
				}
				// <mrow>が省略されているときは，<mrow>に入れてから，2つ目の要素の中にカーソルを移動する
				else {
					var mrow = wrapChildNodes( previousSibling );
					setCursorIn( mrow[ 1 ] );
				}
			}
			
			// previousSiblingが3つのパラメータを取る要素（msubsupなど）のとき
			else if ( previousSibling.nodeName in TRINARY_ELEMENT ) {
				// ちゃんと全部<mrow>に入っていれば，3つ目の要素の中にカーソルを移動する
				if ( previousSibling.childNodes[ 0 ].nodeName == 'mrow'
				  && previousSibling.childNodes[ 1 ].nodeName == 'mrow'
				  && previousSibling.childNodes[ 2 ].nodeName == 'mrow' ) {
					setCursorIn( previousSibling.childNodes[ 2 ] );
				}
				// <mrow>が省略されているときは，<mrow>を入れてから，3つ目の要素の中にカーソルを移動する
				else {
					var mrow = wrapChildNodes( previousSibling );
					setCursorIn( mrow[ 2 ] );
				}
			}
			
			// previousSiblingがmsqrt要素のとき
			else if ( previousSibling.nodeName == 'msqrt' ) {
				// ちゃんと全部<mrow>に入っていれば，カーソルを移動する
				if ( previousSibling.childNodes[ 0 ].nodeName == 'mrow') {
					setCursorIn( previousSibling.childNodes[ 0 ] );
				}
				// <mrow>が省略されているときは，<mrow>を入れてから，カーソルを移動する
				else {
					var mrow = wrapChildNodes( previousSibling );
					setCursorIn( mrow );
				}
			}
			
			// previousSiblingがmfenced要素のとき
			else if ( previousSibling.nodeName == 'mfenced' ) {
				
				// mtableのとき
				if ( previousSibling.firstChild.nodeName == 'mtable' ) {
					setCursorIn( previousSibling.firstChild.lastChild.lastChild );
				}
				else {
					setCursorIn( previousSibling.firstChild );
				}
			}
			
			// previousSiblingがmrow要素のとき
			else if ( previousSibling.nodeName == 'mrow' ) {
				if ( previousSibling.parentNode.nodeName in BINARY_ELEMENT
				  || previousSibling.parentNode.nodeName in TRINARY_ELEMENT ) {
					setCursorIn( previousSibling );
				}
				else {
					setCursorIn( previousSibling );
					moveLeft();
				}
			}
			
			// それ以外の要素（mi, mo, mn）のとき（mtextをどうするか）
			else {
				setCursorBefore( previousSibling );
			}
		}
		
		// previousSiblingがないとき
		
		// 行の始めの場合
		else if ( inputting.parentNode.nodeName == 'mstyle' ) {
			var math = inputting.parentNode.parentNode;
			
			// 最初の行の最初の文字であればモード切り替え
			if ( Suim.util.getNodeNumber( math ) == 0 ) {
				switchMathMode( 'off' );
				return;
			}
			else {
				moveUp();
			}
		}
		
		// mrowから出るとき
		else if ( inputting.parentNode.nodeName == 'mrow'
		       || inputting.parentNode.getAttribute( 'class' ) == 'editbox' ) {
			setCursorBefore( inputting.parentNode );
			moveLeft();
		}
		
		// それ以外の場合から出るとき
		else {
			setCursorBefore( inputting.parentNode );
		}
	}
	
	
	// カーソルを右に移動
	function moveRight()
	{
		// 入力途中（INPUTTING_STYLEのとき）
		if ( inputting.childNodes.length > 1 ) {
			if ( cursor.nextSibling ) {
				range.setStartAfter( cursor.nextSibling );
				range.collapse( true );
				range.insertNode( cursor );
			}
			else {
				completeConversion();
			}
			return;
		}
		
		// 行列要素の中の場合
		if ( isIn( 'mtable' ) && !inputting.nextSibling && inputting.parentNode.nodeName == 'mtd' ) {
			var mrow = Suim.util.searchAncestorByTagName( 'mtable', inputting ).parentNode;
			var mtable = Suim.util.searchAncestorByTagName( 'mtable', inputting );
			var mtr = inputting.parentNode.parentNode;
			var mtd = inputting.parentNode;
			var i = Suim.util.getNodeNumber( mtr ) + 1;
			var j = Suim.util.getNodeNumber( mtd ) + 1;
			var target;
			if ( i == mtable.childNodes.length && j == mtr.childNodes.length ) {
				setCursorAfter( mrow );
				return;
			}
			else if ( j == mtr.childNodes.length ) {
				var target = mtr.nextSibling.firstChild;
			}
			else {
				var target = mtd.nextSibling;
			}
			setCursorIn( target );
			return;
		}
		
		var nextSibling = inputting.nextSibling;
		
		// nextSiblingがあるとき
		if ( nextSibling ) {
			
			// nextSiblingが2つのパラメータを取る要素（mfrac, msubなど）のとき
			if ( nextSibling.nodeName in BINARY_ELEMENT ) {
				// ちゃんと全部<mrow>に入っていれば，1つ目の要素の中にカーソルを移動する
				if ( nextSibling.childNodes[ 0 ].nodeName == 'mrow'
				  && nextSibling.childNodes[ 1 ].nodeName == 'mrow' ) {
					setCursorAtStartIn( nextSibling.childNodes[ 0 ] );
				}
				// <mrow>が省略されている場合，<mrow>を入れて，1つ目の要素の中にカーソルを移動する
				else {
					var mrow = wrapChildNodes( nextSibling );
					setCursorAtStartIn( mrow[ 0 ] );
				}
			}
			
			// nextSiblingが3つのパラメータを取る要素（msubsupなど）のとき
			else if ( nextSibling.nodeName in TRINARY_ELEMENT ) {
				// ちゃんと全部<mrow>に入っていれば，1つ目の要素の中にカーソルを移動する
				if ( nextSibling.childNodes[ 0 ].nodeName == 'mrow'
				  && nextSibling.childNodes[ 1 ].nodeName == 'mrow'
				  && nextSibling.childNodes[ 2 ].nodeName == 'mrow' ) {
					setCursorAtStartIn( nextSibling.childNodes[ 0 ] );
				}
				// <mrow>が省略されているときは，<mrow>を入れてから，カーソルを移動する
				else {
					var mrow = wrapChildNodes( nextSibling );
					setCursorAtStartIn( mrow[ 0 ] );
				}
			}
			
			// nextSiblingがmsqrt要素のとき
			else if ( nextSibling.nodeName == 'msqrt' ) {
				// ちゃんと全部<mrow>に入っていれば，カーソルを移動する
				if ( nextSibling.childNodes[ 0 ].nodeName == 'mrow' ) {
					setCursorAtStartIn( nextSibling.childNodes[ 0 ] );
				}
				// <mrow>が省略されているときは，<mrow>を入れてから，カーソルを移動する
				else {
					var mrow = wrapChildNodes( nextSibling );
					setCursorAtStartIn( mrow );
				}
			}
			
			// nextSiblingがmfenced要素のとき
			else if ( nextSibling.nodeName == 'mfenced' ) {
				// mtableのとき
				if ( nextSibling.firstChild.nodeName == 'mtable' ) {
					setCursorIn( nextSibling.firstChild.firstChild.firstChild );
				}
				else {
					setCursorAtStartIn( nextSibling.firstChild );
				}
			}
			
			// nextSiblingがmrow要素のとき
			else if ( nextSibling.nodeName == 'mrow' ) {
				if ( nextSibling.firstChild ) {
					if ( nextSibling.parentNode.nodeName in BINARY_ELEMENT
					  || nextSibling.parentNode.nodeName in TRINARY_ELEMENT ) {
						setCursorAtStartIn( nextSibling );
					}
					else {
						setCursorAtStartIn( nextSibling );
						moveRight();
					}
				}
				else {
					setCursorIn( nextSibling );
				}
			}
			
			// それ以外の要素（mi, mo, mn）のとき（mtextをどうするか）
			else {
				setCursorAfter( nextSibling );
			}
		}
		
		// nextSiblingがないとき
		
		// mfrac, msubなどから出るとき
		else if ( inputting.parentNode.nodeName in BINARY_ELEMENT
		       || inputting.parentNode.nodeName in TRINARY_ELEMENT
		       || inputting.parentNode.nodeName == 'msqrt'
		       || inputting.parentNode.nodeName == 'mfenced' ) {
			setCursorAfter( inputting.parentNode );
		}
		
		// 行の最後の場合
		else if ( inputting.parentNode.nodeName == 'mstyle' )  {
			var math = inputting.parentNode.parentNode;
			
			// 最後の行の最後の文字であればモード切り替え
			if ( Suim.util.getNodeNumber( math ) == math.parentNode.childNodes.length - 1 ) {
				switchMathMode( 'off' );
				return;
			}
			else {
				moveDown();
			}
		}
		
		// それ以外の場合（mrow）から出るとき
		else {
			setCursorAfter( inputting.parentNode );
			moveRight();
		}
	}
	
	
	// カーソルを上に移動
	function moveUp()
	{
		if ( inputting.childNodes.length == 1 )
		{
			// msubなどのとき，2番目のノードにいたら1番目のノードに移動する
			if ( isIn( 'mfrac' ) || isIn( 'msub' ) || isIn( 'munder' ) || isIn( 'msubsup' ) || isIn( 'munderover' ) ) {
				var mrow = Suim.util.searchAncestorByTagName( 'mrow', inputting );
				if ( mrow.parentNode.nodeName in { 'mfrac':1, 'msub':1, 'munder':1, 'msubsup':1, 'munderover':1 } ) {
					var n = Suim.util.getNodeNumber( mrow );
					if (n == 1) {
						setCursorIn( mrow.parentNode.childNodes[ 0 ] );
						return;
					}
				}
			}
			
			// msupなどのとき，1番目のノードにいたら2番目のノードに移動する
			if ( isIn( 'msup' ) || isIn( 'mover' ) ) {
				var mrow = Suim.util.searchAncestorByTagName( 'mrow', inputting );
				if ( mrow.parentNode.nodeName in { 'msup':1, 'mover':1 } ) {
					var n = Suim.util.getNodeNumber( mrow );
					if ( n == 0 ) {
						setCursorIn( mrow.parentNode.childNodes[ 1 ] );
						return;
					}
				}
			}
			
			// msubsupなどのとき，1番目のノードにいたら3番目のノードに移動する
			if ( isIn( 'msubsup' ) || isIn( 'munderover' ) ) {
				var mrow = Suim.util.searchAncestorByTagName( 'mrow', inputting );
				if ( mrow.parentNode.nodeName in { 'msubsup':1, 'munderover':1} ) {
					var n = Suim.util.getNodeNumber( mrow );
					if ( n == 0 ) {
						setCursorIn( mrow.parentNode.childNodes[ 2 ] );
						return;
					}
				}
			}
			
			// 行列要素の中の場合
			if ( isIn( 'mtable' ) ) {
				var mtd = Suim.util.searchAncestorByTagName( 'mtd', inputting );
				var mtr = mtd.parentNode;
				var i = Suim.util.getNodeNumber( mtr ) + 1;
				var j = Suim.util.getNodeNumber( mtd ) + 1;
				var target;
				if ( i > 1 ) {
					setCursorIn( mtr.previousSibling.childNodes[ j - 1 ] );
					return;
				}
			}
			
			var math = Suim.util.searchAncestorByTagName( 'math', inputting );
			
			// １行目のとき
			if ( Suim.util.getNodeNumber( math ) == 0 ) {
				// 行の始めのとき
				if ( !inputting.previousSibling && inputting.parentNode.nodeName == 'mstyle' ) {
					if ( math.parentNode.previousSibling ) {
						switchMathMode( 'off' );
					}
				}
				else {
					setCursorBefore( math.firstChild.firstChild );
				}
			}
			
			// 上の行があれば上の行の一番後ろにカーソル移動
			else {
				setCursorIn( math.previousSibling.firstChild );
			}
		}
		// 入力途中の場合、候補リスト内を移動
		else {
			if ( useSuggestion ) {
				suggest.moveUp();
			}
		}
	}
	
	
	// フォーカスが外れたとき
	function onBlur( event )
	{
		if ( !isMathMode ) { return; }
		
		// Suimのiframeがフォーカスが解けたら，カーソルを消す
		stopBlinking();
	}
	
	
	// 文字キーが押されたとき
	function onCharacterKeyPress( event )
	{
		if ( !isMathMode ) { return; }
		
		event.preventDefault();
		startBlinking();
			
		// もしエディットボックスがあったら消す
		if ( inputting.parentNode.getAttribute( 'class' ) == 'editbox' ) {
			var target = inputting.parentNode.parentNode;
			target.removeChild( inputting.parentNode );
			setCursorIn( target );
		}
		
		var inputChar = String.fromCharCode( event.charCode ); // 今入力された１文字
		
		if ( inputting.childNodes.length == 1 ) { // 1文字目入力時の処理
			if ( inputting.previousSibling ) {
				
				switch ( inputChar ) {
					
					case '/':
						changePreviousSiblingToNumerator();
						return;
						
					case '\\':
						changePreviousSiblingToDenominator();
						return;
						
					case '_':
						if ( inputting.previousSibling.lastChild
						  && inputting.previousSibling.lastChild.nodeValue in UNDEROVER_CHAR ) {
							changePreviousSiblingTo( 'munder' );
							return;
						}
						else {
							changePreviousSiblingTo( 'msub' );
							return;
						}
						
					case '^':
						if ( inputting.previousSibling.lastChild
						  && inputting.previousSibling.lastChild.nodeValue in UNDEROVER_CHAR ) {
							changePreviousSiblingTo( 'mover' );
							return;
						}
						else {
							changePreviousSiblingTo( 'msup' );
							return;
						}
					
				}
			}
			
			// 左括弧が入力されたとき
			if ( inputChar in LEFT_FENCE ) {
				// ペアになっていない右括弧があったらそれと一緒に<mfenced>にする
				var rightFence = Suim.util.searchRightFence( FENCE_PAIR[ inputChar ], inputting );
				if ( rightFence ) {
					var mfenced = createMathmlElement( 'mfenced' );
					mfenced.setAttribute( 'open', inputChar );
					mfenced.setAttribute( 'close', FENCE_PAIR[ inputChar ] );
					var mrow = createMathmlElement( 'mrow' );
					range.setStartBefore( inputting );
					range.setEndBefore( rightFence );
					range.surroundContents( mrow );
					range.surroundContents( mfenced );
					rightFence.parentNode.removeChild( rightFence );
					mfenced.setAttribute( 'style', SELECTED_STYLE );
					setTimeout( function () { mfenced.removeAttribute( 'style' ); }, 300 );
					return;
				}
				// ペアがなければ普通に<mfenced>をつくる
				else if ( inputChar != '|' ) {
					createFences( inputChar, FENCE_PAIR[ inputChar ] );
					return;
				}
			}
			
			// 右括弧が入力されたとき
			if ( inputChar in RIGHT_FENCE ) {
				// ペアになっていない左括弧があったらそれと一緒に<mfenced>にする
				var leftFence = Suim.util.searchLeftFence( FENCE_PAIR[ inputChar ], inputting );
				if ( leftFence ) {
					var mfenced = createMathmlElement( 'mfenced' );
					mfenced.setAttribute( 'open', FENCE_PAIR[ inputChar ] );
					mfenced.setAttribute( 'close', inputChar );
					var mrow = createMathmlElement( 'mrow' );
					range.setStartAfter( leftFence );
					range.setEndBefore( inputting );
					range.surroundContents( mrow );
					range.surroundContents( mfenced );
					leftFence.parentNode.removeChild( leftFence );
					mfenced.setAttribute( 'style', SELECTED_STYLE );
					setTimeout( function () { mfenced.removeAttribute( 'style' ); }, 300 );
					return;
				}
			}
			
			// inputting要素に下線スタイルをつける
			inputting.setAttribute( 'style', INPUTTING_STYLE );
		}
		
		// 変換中（スペースキーを押した状態）ではない場合
		if ( !isConverted ) {
			
			// 入力された１文字を適切なMathML要素（<mn> or <mo> or <mi>）に入れ，inputting要素に挿入
			var textNode = idocument.createTextNode( inputChar );
			var elementNode;
			
			// 数字だったら<mn>
			if ( event.charCode >= 48 && event.charCode <= 57 ) {
				elementNode = createMathmlElement( 'mn' );
			}
			else {
				// 演算子だったら<mo>、文字だったら<mi>
				var tag = ( ( 'A' > inputChar || inputChar > 'Z' ) && ( 'a' > inputChar || inputChar > 'z' ) ? 'mo' : 'mi' );
				elementNode = createMathmlElement( tag );
			}
			elementNode.appendChild( textNode );
			
			// 今作成したelementNodeを<mspace id='cursor'></mspace>の前に挿入
			range.setStartBefore( cursor );
			range.collapse( true );
			range.insertNode( elementNode );
			
			// 候補の更新
			if ( useSuggestion ) {
				if ( inputting.childNodes.length > SUGGEST_LENGTH ) {
					suggest.update( Suim.util.extractText( inputting ) );
				}
			}
			
		// 変換中（スペースキーを押した状態）の場合，確定してから文字を追加する
		}
		else if ( isConverted ) {
			completeConversion();
			onCharacterKeyPress( event );
		}
	}
	
	
	// クリックされたとき
	function onClick( event )
	{
		// スタイル除去
		if ( selectedNodes ) {
			selectedNodes.removeAttribute( 'style' );
			selectedNodes = null;
		}
		if ( currentGroup ) {
			currentGroup.removeAttribute( 'style' );
			currentGroup = null;
		}
		
		// クリックされた部分のRangeを取得
		var range = getRange();
		
		// 数式モードでないとき
		if ( !isMathMode ) {
			if ( Suim.util.searchAncestorByClassName( 'math', range.startContainer )
			  && Suim.util.searchAncestorByClassName( 'math', range.startContainer ).firstChild.nodeName == 'math' ) {
				switchMathMode( 'on' );
			}
			else {
				return;
			}
		}
		
		// 数式モードのときに，通常エリアをクリックしたとき
		else if ( !Suim.util.searchAncestorByClassName( 'math', range.startContainer ) ) {
			var startContainer = range.startContainer;
			var startOffset = range.startOffset;
			completeConversion();
			stopBlinking();
			var math = Suim.util.searchAncestorByTagName( 'math', inputting );
			switchMathMode( 'off' );
			if ( math.firstChild.childNodes.length == 1 && math.firstChild.firstChild == inputting ) {
				math.parentNode.parentNode.removeChild( math.parentNode );
			}
			range = getRange();
			range.setStart( startContainer, startOffset );
			range.collapse( true );
			return;
		}
		
		// クリックされたのがTextNodeの時，以下の処理を実行
		if ( range.startContainer.nodeType == range.startContainer.TEXT_NODE ) {
			
			var elementNode = range.startContainer.parentNode; // <mi>とか
			
			completeConversion();
			
			// 文字の左半分をクリックした場合（startOffsetが0），前にカーソルを移動
			if ( range.startOffset == 0 ) {
				
				// mfracなどがmrowではなく直に子要素を持っていたらmrowで包んでおく
				if ( elementNode.parentNode.nodeName in BINARY_ELEMENT
				  || elementNode.parentNode.nodeName in TRINARY_ELEMENT ) {
					var n = Suim.util.getNodeNumber( elementNode );
					var mrow = wrapChildNodes( elementNode.parentNode );
					setCursorBefore( mrow[ n ].firstChild );
				}
				// クリックした文字の前にカーソルを移動
				else {
					setCursorBefore( elementNode );
				}
				
			// 文字の右半分をクリックした場合（startOffsetが1），後ろにカーソルを移動
			}
			else {
				
				// mfracなどがmrowではなく直に子要素を持っていたらmrowで包んでおく
				if ( elementNode.parentNode.nodeName in BINARY_ELEMENT
				  || elementNode.parentNode.nodeName in TRINARY_ELEMENT ) {
					var n = Suim.util.getNodeNumber( elementNode );
					var mrow = wrapChildNodes( elementNode.parentNode );
					setCursorAfter( mrow[ n ].lastChild );
				}
				// クリックした文字の後にカーソルを移動
				else {
					setCursorAfter( elementNode );
				}
			}
		}
		
		// エディットボックスをクリックしたらそこにカーソル移動
		else if ( event.target.getAttribute( 'class' ) == 'editbox' ) {
			completeConversion();
			setCursorIn( event.target );
		}
		
		// mrow要素の中だったらcurrentGroupを更新
		if ( inputting.parentNode.nodeName == 'mrow' ) {
			currentGroup = inputting.parentNode;
			currentGroup.setAttribute( 'style', GROUP_STYLE );
		}
		
		startBlinking();
	}
	
	
	// Deleteキーが押されたとき
	function onDeleteKeyPress( event )
	{
		// 数式モードではない場合
		if ( !isMathMode ) {
			
			range = getRange();
			
			// テキストノードにいる場合
			if ( range.startContainer.nodeType == range.startContainer.TEXT_NODE
			  && range.startOffset == 0
			  && range.startContainer.previousSibling
			  && range.startContainer.previousSibling.getAttribute
			  && range.startContainer.previousSibling.getAttribute( 'class' ) == 'math'
			  && range.startContainer.previousSibling.lastChild.nodeName == 'math' ) {
				event.preventDefault();
				switchMathMode( 'on' );
				setCursorIn( range.startContainer.previousSibling.lastChild.firstChild );
			}
			
			// エレメントノードにいる場合
			else if ( range.startContainer.nodeType == range.startContainer.ELEMENT_NODE
			  && range.startOffset > 0
			  && range.startContainer.childNodes[ range.startOffset - 1 ].getAttribute
			  && range.startContainer.childNodes[ range.startOffset - 1 ].getAttribute( 'class' ) == 'math'
			  && range.startContainer.childNodes[ range.startOffset - 1 ].lastChild.nodeName == 'math' ) {
				event.preventDefault();
				switchMathMode( 'on' );
				setCursorIn( range.startContainer.childNodes[ range.startOffset - 1 ].lastChild.firstChild );
			}
			// それ以外の保証
			else {
				setTimeout( function () {
					range = getRange();
					if ( Suim.util.searchAncestorByClassName( 'math', range.startContainer )
					  && Suim.util.searchAncestorByClassName( 'math', range.startContainer ).lastChild.nodeName == 'math' ) {
						event.preventDefault();
						switchMathMode( 'on' );
						setCursorIn( Suim.util.searchAncestorByClassName( 'math', range.startContainer ).lastChild.firstChild);
					}
				}, 1 );
			}
		}
		
		// 数式モードの場合
		else {
			event.preventDefault();
			startBlinking();
			deleteCharacter();
		}
	}
	
	
	// エンターキーが押されたとき
	function onEnterKeyDown( event )
	{
		if ( !isMathMode ) { return; }
		
		startBlinking();
		
		// 候補リストを選択しているとき
		if ( useSuggestion ) {
			if ( suggest.selected >= 0 ) {
				suggest.insert();
				return;
			}
		}
		
		// １文字目入力の場合
		if ( inputting.childNodes.length == 1 ) {
			
			// 行列の中だったら行列内でカーソル移動
			if ( isIn( 'mtable' ) ) {
				var mtd = Suim.util.searchAncestorByTagName( 'mtd', inputting );
				var mtr = mtd.parentNode;
				var mtable = mtr.parentNode;
				var mrow = mtable.parentNode;
				var i = Suim.util.getNodeNumber( mtr ) + 1;
				var j = Suim.util.getNodeNumber( mtd ) + 1;
				var target;
				if ( i == mtable.childNodes.length && j == mtr.childNodes.length ) {
					setCursorAfter( mrow );
					return;
				}
				else if ( j == mtr.childNodes.length ) {
					var target = mtr.nextSibling.firstChild;
				}
				else {
					var target = mtd.nextSibling;
				}
				if ( target.firstChild ) {
					if ( target.firstChild.getAttribute( 'class' ) == 'editbox' ) {
						setCursorIn( target.firstChild );
						return;
					}
				}
				setCursorIn( target );
				return;
			}
			
			// 行に何も書かれていなかったら何もしない
			if ( inputting.parentNode.childNodes.length == 1 ) {
				return;
			}
			
			// mstyleの直接の子だったら，行を追加
			if ( inputting.parentNode.nodeName == 'mstyle' ) {
				addNewLine();
				return;
			}
		}
		
		completeConversion();
	}
	
	
	// 下キーが押されたとき
	function onDownKeyPress( event )
	{
		// 数式モードではない場合
		if ( !isMathMode ) {
			setTimeout( function () {
				range = getRange();
				if ( Suim.util.searchAncestorByTagName( 'math', range.startContainer ) ) {
					switchMathMode( 'on' );
					if ( range.startContainer.nodeType == range.startContainer.TEXT_NODE ) {
						var target = range.startContainer.parentNode;
						if ( range.startOffset == 0 ) {
							setCursorBefore( target );
						}
						else {
							setCursorAfter( target );
						}
					}
					else {
						var mstyle = Suim.util.searchAncestorByTagName( 'math', range.startContainer ).firstChild;
						setCursorAtStartIn( mstyle );
					}
				}
			}, 1 );
			return;
		}
		
		// 数式モードの場合
		else {
			event.preventDefault();
			startBlinking();
			moveDown();
		}
	}
	
	// フォーカスされたとき
	function onFocus( event )
	{
		if ( !isMathMode ) {
			range = getRange();
			if ( Suim.util.searchAncestorByClassName( 'math', range.startContainer ) ) {
				setTimeout( function() { onClick( event ); }, 1 );
			}
			return;
		}
		
		// Suimのiframeがフォーカスされたら，カーソルを点滅させる
		startBlinking();
	}
	
	
	// キーが押されたとき（keydown）
	function onKeyDown( event )
	{
		// Ctrl + m でモード切り替え
		if ( event.keyCode == 77 && event.ctrlKey ) {
			event.preventDefault();
			toggleMathMode();
			return;
		}
		
		// Delete Key
		if ( event.keyCode == 8 ) {
			if ( Suim.browser.isChrome() ) { // ChromeはDeleteキーのKeyPressイベントが発生しない
				onDeleteKeyPress( event );
				return;
			}
		}
		// Tab Key
		else if ( event.keyCode == 9 ) {
		}
		// Enter Key
		else if ( event.keyCode == 13 ) {
			onEnterKeyDown( event );
		}
		// Escape Key
		else if ( event.keyCode == 27 ) {
		
		}
		// Space Key
		else if( event.keyCode == 32 ) {
		
		}
		// Arrow Keys
		if ( Suim.browser.isSafari() || Suim.browser.isChrome() ) { // Safari/Chromeは矢印キーのKeyPressイベントが発生しない
			if ( event.keyCode == 37 ) {
				onLeftKeyPress( event );
			}
			else if ( event.keyCode == 38 ) {
				onUpKeyPress( event );
			}
			else if ( event.keyCode == 39 ) {
				onRightKeyPress( event );
			}
			else if ( event.keyCode == 40 ) {
				onDownKeyPress( event );
			}
		}
		// Character Key
		else {
			
		}
	}
	
	
	// キーが押されたとき（keypress）
	function onKeyPress( event )
	{
		// Ctrl + m でモード切り替え
		if ( event.charCode == 109 && event.ctrlKey ) {
			event.preventDefault();
			return;
		}
		
		if ( currentGroup ) {
			currentGroup.removeAttribute( 'style' );
		}
		
		// Delete Key
		if ( event.keyCode == 8 || event.keyCode == 46 ) {
			onDeleteKeyPress( event );
			return;
		}
		
		// Tab Key
		if ( event.keyCode == 9 ) {
			onTabKeyPress( event );
		}
		// Enter Key
		else if ( event.keyCode == 13 ) {
			
		}
		// Escape Key
		else if ( event.keyCode == 27 ) {
			
		}
		// Space Key
		else if ( event.charCode == 32 ) {
			onSpaceKeyPress( event );
		}
		// Arrow Keys
		else if ( event.keyCode == 37 ) {
			onLeftKeyPress( event );
		}
		else if ( event.keyCode == 38 ) {
			onUpKeyPress( event );
		}
		else if ( event.keyCode == 39 ) {
			onRightKeyPress( event );
		}
		else if ( event.keyCode == 40 ) {
			onDownKeyPress( event );
		}
		// Symbol Key
		else if ( event.charCode in FF_SYMBOL_KEYCODE ) {
			onCharacterKeyPress( event );
		}
		// Number Key
		else if ( event.charCode >= 48 && event.charCode <= 57 ) {
			onCharacterKeyPress( event );
		}
		// Character Key
		else if ( event.charCode >= 65 && event.charCode <= 90 || event.charCode >= 97 && event.charCode <= 122 ) {
			onCharacterKeyPress( event );
		}
		
		if ( !isMathMode ) { return; }
		
		if ( selectedNodes ) {
			selectedNodes.removeAttribute( 'style' );
			selectedNodes = null;
		}
		
		if ( inputting.parentNode.nodeName == 'mrow' ) {
			currentGroup = inputting.parentNode;
			currentGroup.setAttribute( 'style', GROUP_STYLE );
		}
	}
	
	
	// 左キーが押されたとき
	function onLeftKeyPress( event )
	{
		// 数式モードではない場合
		if ( !isMathMode ) {
			range = getRange();
			
			// テキストノードにいる場合
			if ( range.startContainer.nodeType == range.startContainer.TEXT_NODE
			  && range.startOffset == 0
			  && range.startContainer.previousSibling
			  && range.startContainer.previousSibling.getAttribute
			  && range.startContainer.previousSibling.getAttribute( 'class' ) == 'math'
			  && range.startContainer.previousSibling.lastChild.nodeName == 'math' ) {
				switchMathMode( 'on' );
				setCursorIn( range.startContainer.previousSibling.lastChild.firstChild );
			}
			// エレメントノードにいる場合
			else if ( range.startContainer.nodeType == range.startContainer.ELEMENT_NODE
			  && range.startOffset > 0
			  && range.startContainer.childNodes[ range.startOffset - 1 ].getAttribute
			  && range.startContainer.childNodes[ range.startOffset - 1 ].getAttribute( 'class' ) == 'math'
			  && range.startContainer.childNodes[ range.startOffset - 1 ].lastChild.nodeName == 'math' ) {
				switchMathMode( 'on' );
				setCursorIn( range.startContainer.childNodes[ range.startOffset - 1 ].lastChild.firstChild );
			}
			// それ以外の保証
			else {
				setTimeout( function () {
					range = getRange();
					if ( Suim.util.searchAncestorByClassName( 'math', range.startContainer )
					  && Suim.util.searchAncestorByClassName( 'math', range.startContainer ).lastChild.nodeName == 'math' ) {
						switchMathMode( 'on' );
						setCursorIn( Suim.util.searchAncestorByClassName( 'math', range.startContainer ).lastChild.firstChild);
					}
				}, 1 );
			}
		}
		
		// 数式モードの場合
		else {
			event.preventDefault();
			startBlinking();
			moveLeft();
		}
	}
	
	
	// 右キーが押されたとき
	function onRightKeyPress( event )
	{
		// 数式モードではない場合
		if ( !isMathMode ) {
			
			range = getRange();
			
			// テキストノードにいる場合
			if ( range.startContainer.nodeType == range.startContainer.TEXT_NODE
			  && range.startOffset == range.startContainer.length
			  && range.startContainer.nextSibling
			  && range.startContainer.nextSibling.getAttribute
			  && range.startContainer.nextSibling.getAttribute( 'class' ) == 'math'
			  && range.startContainer.nextSibling.firstChild.nodeName == 'math' ) {
				switchMathMode( 'on' );
				var mstyle = range.startContainer.nextSibling.firstChild.firstChild;
				if ( mstyle.firstChild && mstyle.firstChild != inputting ) {
					setCursorBefore( mstyle.firstChild );
				}
			}
			
			// エレメントノードにいる場合
			else if ( range.startContainer.nodeType == range.startContainer.ELEMENT_NODE
			  && range.startOffset > 0
			  && range.startContainer.childNodes[ range.startOffset ].getAttribute
			  && range.startContainer.childNodes[ range.startOffset ].getAttribute( 'class' ) == 'math'
			  && range.startContainer.childNodes[ range.startOffset ].firstChild.nodeName == 'math' ) {
				var mstyle = range.startContainer.childNodes[ range.startOffset ].firstChild.firstChild;
				switchMathMode( 'on' );
				if ( mstyle.firstChild && mstyle.firstChild != inputting ) {
					setCursorBefore( mstyle.firstChild );
				}
			}
			// それ以外の保証
			else {
				setTimeout( function () {
					range = getRange();
					if ( Suim.util.searchAncestorByClassName( 'math', range.startContainer )
					  && Suim.util.searchAncestorByClassName( 'math', range.startContainer ).firstChild.nodeName == 'math' ) {
						switchMathMode( 'on' );
						setCursorAtStartIn( Suim.util.searchAncestorByClassName( 'math', range.startContainer ).firstChild.firstChild);
					}
				}, 1 );
			}
		}
		
		// 数式モードの場合
		else {
			event.preventDefault();
			startBlinking();
			moveRight();
		}
	}
	
	
	// スペースキーが押されたとき
	function onSpaceKeyPress( event )
	{
		if ( !isMathMode ) { return; }
		event.preventDefault();
		startBlinking();
		
		// 1文字も入力されていない状態でスペースキーを押したとき，<mspace>をつくる
		if ( inputting.childNodes.length == 1 ) {
			// もしエディットボックスの中だったらエディットボックスを消す
			if ( inputting.parentNode.getAttribute( 'class' ) == 'editbox' ) {
				var target = inputting.parentNode.parentNode;
				target.removeChild( inputting.parentNode );
				setCursorIn( target );
			}
			var mspace = createMathmlElement( 'mspace' );
			mspace.setAttribute( 'width', MSPACE_WIDTH );
			mspace.setAttribute( 'height', CURSOR_HEIGHT );
			mspace.setAttribute( 'depth', CURSOR_DEPTH );
			range.setStartBefore(inputting);
			range.collapse( true );
			range.insertNode(mspace);
			return;
		}
		
		// 通常の場合（isConverted状態じゃない場合）
		if ( !isConverted ) {
			
			isConverted = true;
			
			// 候補リスト非表示
			if ( useSuggestion ) {
				suggest.hide();
				suggest.selected = -1;
			}
			
			// inputting要素の中のテキストのみを抜き出して，１つの文字列にする
			var targetString = Suim.util.extractText( inputting );
			
			// 変換前のinputting要素の中身をpreConvertedNodesに避難
			range.selectNodeContents( inputting );
			preConvertedNodes = range.extractContents();
			
			// targetStringをMathMLに変換，convert要素の中に入れる
			convertToMathml( targetString );
			
			inputting.setAttribute( 'style', CONVERTED_STYLE );
		}
		
		// 変換中（スペースキーを押した状態）の場合，preConvertedNodesを使って元に戻す
		else if ( isConverted ) {
			
			isConverted = false;
			
			// 候補リスト表示
			if ( useSuggestion ) {
				suggest.update( Suim.util.extractText( preConvertedNodes ) );
			}
			
			inputting.setAttribute( 'style', INPUTTING_STYLE );
			range.selectNodeContents( inputting );
			range.deleteContents();
			inputting.appendChild( preConvertedNodes );
			inputting.appendChild( cursor )
		}
	}
	
	
	// タブキーが押されたとき
	function onTabKeyPress( event )
	{
		if ( !isMathMode ) { return; }
		event.preventDefault();
		startBlinking();
		
		// 候補リストの移動
		if ( useSuggestion ) {
			if ( suggest.box.style.display == 'block' ) {
				if ( event.shiftKey ) {
					suggest.moveUp();
				}
				else {
					suggest.moveDown();
				}
				return;
			}
		}
		
		completeConversion();
		
		if ( !event.shiftKey ) {
			// 行列の中だったら行列内でカーソル移動
			if ( isIn( 'mtable' ) ) {
				var mtd = Suim.util.searchAncestorByTagName( 'mtd', inputting );
				var mtr = mtd.parentNode;
				var mtable = mtr.parentNode;
				var mrow = mtable.parentNode;
				var i = Suim.util.getNodeNumber( mtr ) + 1;
				var j = Suim.util.getNodeNumber( mtd ) + 1;
				var target;
				if ( i == mtable.childNodes.length && j == mtr.childNodes.length ) {
					setCursorAfter( mrow );
					return;
				}
				else if ( j == mtr.childNodes.length ) {
					var target = mtr.nextSibling.firstChild;
				}
				else {
					var target = mtd.nextSibling;
				}
				if ( target.firstChild ) {
					if ( target.firstChild.getAttribute( 'class' ) == 'editbox' ) {
						setCursorIn( target.firstChild );
						return;
					}
				}
				setCursorIn( target );
				return;
			}
			
			// nextSiblingがなくなる場所まで右に移動
			if ( inputting.nextSibling ) {
				while ( inputting.nextSibling ) {
					moveRight();
				}
			} else {
				moveRight();
				while ( inputting.nextSibling ) {
					moveRight();
				}
			}
			
			return;
		}
		
		if ( event.shiftKey ) {
			
			// previousSiblingがなくなる場所まで左に移動
			if ( inputting.previousSibling ) {
				while ( inputting.previousSibling ) {
					moveLeft();
				}
			} else {
				moveLeft();
				while ( inputting.previousSibling ) {
					moveLeft();
				}
			}
			
			return;
		}
	}
	
	
	// 上キーが押されたとき
	function onUpKeyPress( event )
	{
		// 数式モードではない場合
		if ( !isMathMode ) {
			setTimeout( function () {
				range = getRange();
				if ( Suim.util.searchAncestorByTagName( 'math', range.startContainer ) ) {
					switchMathMode( 'on' );
					if ( range.startContainer.nodeType == range.startContainer.TEXT_NODE ) {
						var target = range.startContainer.parentNode;
						if ( range.startOffset == 0 ) {
							setCursorBefore( target );
						}
						else {
							setCursorAfter( target );
						}
					}
					else {
						var mstyle = Suim.util.searchAncestorByTagName( 'math', range.startContainer ).firstChild;
						setCursorIn( mstyle );
					}
				}
			}, 1 );
		}
		
		// 数式モードの場合
		else {
			event.preventDefault();
			startBlinking();
			moveUp();
		}
	}
	
	
	// 数式表記をMathMLに変換
	function parseMath( str, leftBracket )
	{
		str = Suim.util.removeCharsAndBlanks( str, 0 );
		if ( !str ) { return [ null, '' ]; }
		
		var result;
		var node;
		var symbol;
		var fragment = idocument.createDocumentFragment();
		
		if ( leftBracket && str.charAt(0) == FENCE_PAIR[ leftBracket.input ] ) {
			str = Suim.util.removeCharsAndBlanks( str, FENCE_PAIR[ leftBracket.input ].length );
			return [ null, str ];
		}
		
		while ( str ) {
			result = parseMathInfix( str );
			if ( !result ) { return; }
			node = result[ 0 ];
			str  = result[ 1 ];
			
			symbol = Suim.symbol.getSymbol( str );
			
			if ( symbol.type == Suim.symbol.INFIX && symbol.tag == 'mfrac' ) {
				
				node = Suim.util.removeBrackets( node );
				if ( node.firstChild.nodeName != 'mrow' ) {
					node = createMathmlNode( 'mrow', node );
				}
				
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				result = parseMathInfix( str );
				
				if ( !result[ 0 ] ) {
					result[ 0 ] = createMathmlElement( 'mrow' );
					createEditboxIn( result[ 0 ] );
				}
				else {
					result[ 0 ] = Suim.util.removeBrackets( result[ 0 ] );
					if ( !result[ 0 ].firstChild ) {
						createEditboxIn( result[ 0 ] );
					}
					else if ( result[ 0 ].firstChild.nodeName != 'mrow' ) {
						result[ 0 ] = createMathmlNode( 'mrow', result[ 0 ] );
					}
				}
				
				str = result[ 1 ];
				node = createMathmlNode( 'mfrac', node );
				node.appendChild( result[ 0 ] );
			}
			
			if ( node ) {
				fragment.appendChild( node );
			}
			
			if ( leftBracket && symbol.type == Suim.symbol.RIGHTBRACKET ) {
				var mfenced = createMathmlElement( 'mfenced' );
				mfenced.setAttribute( 'open', leftBracket.output );
				mfenced.setAttribute( 'close', symbol.output );
				var mrow = createMathmlElement( 'mrow' );
				mfenced.appendChild( mrow );
				mrow.appendChild( fragment );
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				return [ mfenced, str ];
			}
		}
		
		return [ fragment, str ];
	}
	
	
	// msub, msupを処理
	function parseMathInfix( str )
	{
		var node;
		
		str = Suim.util.removeCharsAndBlanks( str, 0 );
		if ( !str ) { return [ null, '' ]; }
		var symbol1 = Suim.symbol.getSymbol( str );
		
		var result1 = parseMathSymbol( str );
		if ( !result1 ) { return; }
		node = result1[ 0 ];
		str  = result1[ 1 ];
		
		var symbol2 = Suim.symbol.getSymbol( str );
		
		if ( symbol2.type == Suim.symbol.INFIX && symbol2.tag != 'mfrac' ) {
			
			if ( node.firstChild.nodeName != 'mrow' ) {
				node = createMathmlNode( 'mrow', node );
			}
			
			str = Suim.util.removeCharsAndBlanks( str, symbol2.input.length );
			result1 = parseMathSymbol( str );
			
			if ( !result1[ 0 ] ) {
				result1[ 0 ] = createMathmlElement( 'mrow' );
				createEditboxIn( result1[ 0 ] );
			}
			else {
				result1[ 0 ] = Suim.util.removeBrackets( result1[ 0 ] );
				if ( result1[ 0 ].firstChild.nodeName != 'mrow' ) {
					result1[ 0 ] = createMathmlNode( 'mrow', result1[ 0 ] );
				}
			}
			
			str = result1[ 1 ];
			
			if ( symbol2.tag == 'msub' ) {
				var symbol3 = Suim.symbol.getSymbol( str );
				if ( symbol3.tag == 'msup' ) {
					str = Suim.util.removeCharsAndBlanks( str, symbol3.input.length );
					var result2 = parseMathSymbol( str );
					
					if ( !result2[ 0 ] ) {
						result2[ 0 ] = createMathmlElement( 'mrow' );
						createEditboxIn( result2[ 0 ] );
					}
					else {
						result2[ 0 ] = Suim.util.removeBrackets( result2[ 0 ] );
						if ( result2[ 0 ].firstChild.nodeName != 'mrow' ) {
							result2[ 0 ] = createMathmlNode( 'mrow', result2[ 0 ] );
						}
					}
					
					str = result2[ 1 ];
					
					var tag = ( symbol1.type == Suim.symbol.UNDEROVER ) ? 'munderover' : 'msubsup';
					var node = createMathmlNode( tag, node );
					node.appendChild( result1[ 0 ] );
					node.appendChild( result2[ 0 ] );
				}
				else {
					var tag = ( symbol1.type == Suim.symbol.UNDEROVER ) ? 'munder' : 'msub';
					var node = createMathmlNode( tag, node );
					node.appendChild( result1[ 0 ] );
				}
			}
			else if ( symbol2.tag == 'msup' ) {
				var symbol3 = Suim.symbol.getSymbol( str );
				if ( symbol3.tag == 'msub' ) {
					str = Suim.util.removeCharsAndBlanks( str, symbol3.input.length );
					var result2 = parseMathSymbol( str );
					
					if ( !result2[ 0 ] ) {
						result2[ 0 ] = createMathmlElement( 'mrow' );
						createEditboxIn( result2[ 0 ] );
					}
					else {
						result2[ 0 ] = Suim.util.removeBrackets( result2[ 0 ] );
						if ( result2[ 0 ].firstChild.nodeName != 'mrow' ) {
							result2[ 0 ] = createMathmlNode( 'mrow', result2[ 0 ] );
						}
					}
					
					str = result2[ 1 ];
					
					var tag = ( symbol1.type == Suim.symbol.UNDEROVER ) ? 'munderover' : 'msubsup';
					var node = createMathmlNode( tag, node );
					node.appendChild( result2[ 0 ] );
					node.appendChild( result1[ 0 ] );
				}
				else {
					var tag = ( symbol1.type == Suim.symbol.UNDEROVER ) ? 'mover' : 'msup';
					var node = createMathmlNode( tag, node );
					node.appendChild( result1[ 0 ] );
				}
			}
			else {
				node = createMathmlNode( symbol2.tag, node );
				node.appendChild( result1[ 0 ] );
			}
		}
		
		return [ node, str ];
	}
	
	
	// 記号を１つ処理
	function parseMathSymbol( str )
	{
		var node;
		
		str = Suim.util.removeCharsAndBlanks( str, 0 );
		if ( !str ) { return [ null, '' ]; }
		var symbol = Suim.symbol.getSymbol( str );
		
		if ( symbol.type == Suim.symbol.SENTENCE ) {
			symbol = Suim.symbol.getSymbol( str, Suim.symbol.SENTENCE );
		}
		if ( symbol.type == Suim.symbol.ALIAS ) {
			str = symbol.output + Suim.util.removeCharsAndBlanks( str, symbol.input.length );
			symbol = Suim.symbol.getSymbol( str, Suim.symbol.ALIAS );
		}
		
		switch ( symbol.type ) {
			
			case Suim.symbol.UNARY:
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				
				if ( symbol.tag == 'msqrt' ) {
					if ( str.charAt( 0 ) == '[' && str.charAt( 2 ) == ']' ) {
						if ( 0 <= str.charAt( 1 ) && 9 >= str.charAt( 1 ) ) {
							var mn = createMathmlNode( 'mn', str.charAt( 1 ) );
							var mrow = createMathmlNode( 'mrow', mn );
							str = Suim.util.removeCharsAndBlanks( str, 3 );
							var result = parseMathSymbol( str );
							if ( result[ 0 ] ) {
								result[ 0 ] = Suim.util.removeBrackets( result[ 0 ] );
								node = createMathmlNode( 'mroot', result[ 0 ] );
								node.appendChild( mrow );
								str = result[ 1 ];
							}
							else {
								node = createMathmlElement( 'mroot' );
								createEditboxIn( node );
								node.appendChild( mrow );
							}
							break;
						}
					}
				}
				
				node = createMathmlElement( symbol.tag );
				var s = str.charAt( 0 );
				
				var result = parseMathSymbol( str );
				
				if ( typeof symbol.func == 'boolean' && symbol.func ) {
					node.appendChild( idocument.createTextNode( symbol.output ) );
					if ( !result[ 0 ] || ( s == '^'|| s == '_' || s == '/' || s == '|' || s == ',' ) ) {
						break;
					}
					node = createMathmlNode( 'mrow', node );
					node.appendChild( result[ 0 ] );
					str = result[ 1 ];
					break;
				}
				
				str = result[ 1 ];
				
				result[ 0 ] = Suim.util.removeBrackets( result[ 0 ] );
				
				if ( symbol.tag == 'msqrt' ) {
					if ( result[ 0 ] ) {
						node.appendChild( result[ 0 ] );
					}
					else {
						createEditboxIn( node );
					}
					break;
				}
				else if ( typeof symbol.acc == 'boolean' && symbol.acc ) { // hatなど
					var mo = createMathmlNode( 'mo', symbol.output );
					if ( result[ 0 ] ) {
						node.appendChild( result[ 0 ] );
						node.appendChild( mo );
					}
					else {
						node = mo;
					}
					break;
				}
				else { // スタイル
					if ( result[ 0 ] ) {
						node = result[ 0 ];
						node.setAttribute( symbol.atname, symbol.atval );
						break;
					}
					else {
						node = idocument.createDocumentFragment();
						for ( var i = 0; i < symbol.input.length; i++ ) {
							var mi = createMathmlElement( 'mi' );
							mi.appendChild( idocument.createTextNode( symbol.input.slice( i, i + 1 ) ) );
							node.appendChild( mi );
						}
						break;
					}
				}
				
				
			case Suim.symbol.BINARY:
				node = createMathmlElement( symbol.tag );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				node.appendChild( mrow1 ); node.appendChild( mrow2 );
				
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				var result1 = parseMathSymbol( str );
				str = result1[ 1 ];
				
				if ( !result1[ 0 ] ) {
					createEditboxIn( mrow1 );
					createEditboxIn( mrow2 );
					break;
				}
				
				result1[ 0 ] = Suim.util.removeBrackets( result1[ 0 ] );
				
				if ( symbol.tag == 'mfrac' ) {
					mrow1.appendChild( result1[ 0 ] );
				}
				else if ( symbol.tag == 'mroot' || symbol.input == 'mover' ) {
					mrow2.appendChild( result1[ 0 ] );
				}
				
				var result2 = parseMathSymbol( result1[ 1 ] );
				str = result2[ 1 ];
				
				if ( !result2[ 0 ] ) {
					if ( symbol.tag == 'mfrac' ) {
						createEditboxIn( mrow2 );
					}
					else if ( symbol.tag == 'mroot' || symbol.tag == 'mover' ) {
						createEditboxIn( mrow1 );
					}
					break;
				}
				
				result2[ 0 ] = Suim.util.removeBrackets( result2[ 0 ] );
				
				mrow2.appendChild( result2[ 0 ] );
				
				if ( symbol.tag == 'mfrac' ) {
					mrow2.appendChild( result2[ 0 ] );
				}
				else if ( symbol.tag == 'mroot' || symbol.tag == 'mover' ) {
					mrow1.appendChild( result2[ 0 ] );
				}
				break;
				
				
			case Suim.symbol.INFIX:
				node = createMathmlNode( 'mo', symbol.output );
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
				
				
			case Suim.symbol.LEFTBRACKET:
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				
				if ( !str ) {
					if ( typeof symbol.invisible == 'boolean' && symbol.invisible ) {
						node = null;
					}
					else {
						node = createMathmlNode( 'mo', symbol.output );
					}
				}
				else { 
					var result = parseMath( str, symbol );
					node = result[ 0 ];
					str = result[ 1 ];
					if ( result[ 0 ] && result[ 0 ].nodeName != 'mfenced' ) {
						node = idocument.createDocumentFragment();
						node.appendChild( createMathmlNode( 'mo', symbol.output ) );
						node.appendChild( result[ 0 ] );
					}
				}
				break;
				
				
			case Suim.symbol.SPACE:
				node = createMathmlElement( 'mrow' );
				var text = createMathmlElement( symbol.tag );
				var mspace1 = createMathmlElement( 'mspace' );
				var mspace2 = createMathmlElement( 'mspace' );
				mspace1.setAttribute( 'width', '1ex' );
				mspace2.setAttribute( 'width', '1ex' );
				text.appendChild( idocument.createTextNode( symbol.output ) );
				node.appendChild( mspace1 ); node.appendChild( text ); node.appendChild( mspace2 );
				
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
				
				
			case Suim.symbol.TEXT:
				node = createMathmlElement( 'mrow' );
				
				if ( symbol.input != '"' ) {
					str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				}
				var i;
				if ( str.charAt( 0 ) == '{' ) {
					i = str.indexOf( '}' );
				}
				else if ( str.charAt( 0 ) == '(' ) {
					i = str.indexOf( ')' );
				}
				else if ( str.charAt( 0 ) == '[' ) {
					i = str.indexOf( ']' );
				}
				else if ( symbol.input == '"' ) {
					i = str.slice( 1 ).indexOf( '"' ) + 1;
				}
				else {
					i = 0;
				}
				if ( i == -1 ) {
					i = str.length;
				}
				
				var text;
				
				if ( i == 0 ) {
					text = str.slice( 0, 1 );
				}
				else {
					text = str.slice( 1, i );
				}
				
				if ( text.charAt( 0 ) == ' ') {
					var mspace1 = createMathmlElement( 'mspace' );
					mspace1.setAttribute( 'width', '1ex' );
					node.appendChild( mspace1 );
				}
				var mtext = createMathmlElement( symbol.tag );
				mtext.appendChild( idocument.createTextNode( text ) );
				node.appendChild( mtext );
				if ( text.charAt( text.length - 1 ) == ' ' ) {
					var mspace2 = createMathmlElement( 'mspace' );
					mspace2.setAttribute( 'width', '1ex' );
					node.appendChild( mspace2 );
				}
				str = Suim.util.removeCharsAndBlanks( str, i + 1 );
				break;
				
				
			case Suim.symbol.SUBSCRIPT:
				node = createMathmlElement( 'msub' );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				createEditboxIn( mrow1 ); createEditboxIn( mrow2 );
				node.appendChild( mrow1 ); node.appendChild( mrow2 );
				
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
				
				
			case Suim.symbol.SUPERSCRIPT:
				node = createMathmlElement( 'msup' );
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				createEditboxIn( mrow1 ); createEditboxIn( mrow2 );
				node.appendChild( mrow1 ); node.appendChild( mrow2 );
				
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
				
				
			case Suim.symbol.VECTOR:
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				if ( str.charAt(0) in LEFT_FENCE && str.charAt(2) in RIGHT_FENCE ) {
						var number = Number( str.charAt(1) );
						if ( !isNaN( number ) ) {
							createTable( number, 1, str.charAt(0) );
							return;
						}
				}
				node = createMathmlElement( 'mfenced' );
				node.setAttribute( 'open', '(' );
				node.setAttribute( 'close', ')' );
				var mtable = createMathmlElement( 'mtable' );
				var mtd1 = createMathmlElement( 'mtd' );
				var mtd2 = createMathmlElement( 'mtd' );
				createEditboxIn( mtd1 );
				createEditboxIn( mtd2 );
				var mtr1 = createMathmlNode( 'mtr', mtd1 );
				var mtr2 = createMathmlNode( 'mtr', mtd2 );
				mtable.appendChild( mtr1 );
				mtable.appendChild( mtr2 );
				node.appendChild( mtable );
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
				
				
			case Suim.symbol.MATRIX:
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				if ( str.charAt(0) in LEFT_FENCE && str.charAt(2) == ',' && str.charAt(4) in RIGHT_FENCE ) {
						var number1 = Number( str.charAt(1) );
						var number2 = Number( str.charAt(3) );
						if ( !isNaN( number1 ) && !isNaN( number2 ) ) {
							createTable( number1, number2, str.charAt(0) );
							return;
						}
				}
				node = createMathmlElement( 'mfenced' );
				node.setAttribute( 'open', '(' );
				node.setAttribute( 'close', ')' );
				var mtable = createMathmlElement( 'mtable' );
				var mtd11 = createMathmlElement( 'mtd' );
				var mtd12 = createMathmlElement( 'mtd' );
				var mtd21 = createMathmlElement( 'mtd' );
				var mtd22 = createMathmlElement( 'mtd' );
				createEditboxIn( mtd11 );
				createEditboxIn( mtd12 );
				createEditboxIn( mtd21 );
				createEditboxIn( mtd22 );
				var mtr1 = createMathmlNode( 'mtr', mtd11 );
				mtr1.appendChild ( mtd12 );
				var mtr2 = createMathmlNode( 'mtr', mtd21 );
				mtr2.appendChild ( mtd22 );
				mtable.appendChild( mtr1 );
				mtable.appendChild( mtr2 );
				node.appendChild( mtable );
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
				
				
			case Suim.symbol.SIMULEQUATIONS:
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				if ( str.charAt(0) in LEFT_FENCE && str.charAt(2) in RIGHT_FENCE ) {
						var number = Number( str.charAt(1) );
						if ( !isNaN( number ) ) {
							createTable( number, 1, '{' );
							return;
						}
				}
				node = createMathmlElement( 'mfenced' );
				node.setAttribute( 'open', '{' );
				node.setAttribute( 'close', '' );
				var mtable = createMathmlElement( 'mtable' );
				mtable.setAttribute( 'columnalign', 'left' );
				var mtd1 = createMathmlElement( 'mtd' );
				var mtd2 = createMathmlElement( 'mtd' );
				createEditboxIn( mtd1 );
				createEditboxIn( mtd2 );
				var mtr1 = createMathmlNode( 'mtr', mtd1 );
				var mtr2 = createMathmlNode( 'mtr', mtd2 );
				mtable.appendChild( mtr1 );
				mtable.appendChild( mtr2 );
				node.appendChild( mtable );
				break;
				
				
			default:
				node = createMathmlNode( symbol.tag, symbol.output );
				str = Suim.util.removeCharsAndBlanks( str, symbol.input.length );
				break;
		}
		
		return [ node, str ];
	}
	
	
	// MathMLをパース
	function parseMathML( mathml )
	{
		mathml = mathml.replace( /\r\n/g, '' );
		mathml = mathml.replace( /\n/g, '' );
		mathml = mathml.replace( /\t/g, '' );
		mathml = '<data xmlns="http://www.w3.org/1998/Math/MathML">' + mathml + '</data>';
		
		var parser = new DOMParser();
		var dom = parser.parseFromString( mathml, 'text/xml' );
		var mathTree = idocument.createDocumentFragment();
		
		var data = dom.firstChild;
		if ( !data.firstChild ) {
			return null;
		}
		if ( data.firstChild.nodeType != data.firstChild.ELEMENT_NODE ) {
			return false;
		}
		
		for ( var i = 0; i < data.childNodes.length; i++ ) {
			// もしmstyleがなかったら作成する
			if ( data.childNodes[ i ].firstChild.nodeName != 'mstyle' ) {
				var mstyle = createMathmlElement( 'mstyle' );
				mstyle.setAttribute( 'displaystyle', DISPLAYSTYLE );
				range.selectNodeContents( data.childNodes[ i ] );
				range.surroundContents( mstyle );
				data.childNodes[ i ].appendChild( mstyle );
			}
			// スタイルセット
			data.childNodes[ i ].setAttribute( 'display', 'block' );
			data.childNodes[ i ].setAttribute( 'style', MATH_STYLE );
			data.childNodes[ i ].firstChild.setAttribute( 'style', MSTYLE_STYLE );
		}
		
		var range = document.createRange();
		range.selectNodeContents( data );
		data = range.cloneContents();
		
		return data;
	}
	
	
	// XMLをパース
	function parseXML( xml )
	{
		var parser = new DOMParser();
		
		xml = '<body xmlns="http://www.w3.org/1999/xhtml">' + xml + '</body>';
		
		var dom = parser.parseFromString( xml, 'text/xml' );
		
		var range = document.createRange();
		range.selectNodeContents( dom.firstChild );
		var data = range.cloneContents();
		
		return data;
	}
	
	
	// iframeにイベントリスナを設定
	function setEventListener()
	{
		Suim.util.addEventListener( iwindow, 'click',    onClick );
		Suim.util.addEventListener( iwindow, 'focus',    onFocus );
		Suim.util.addEventListener( iwindow, 'blur',     onBlur );
		Suim.util.addEventListener( iwindow, 'keydown',  onKeyDown );
		Suim.util.addEventListener( iwindow, 'keypress', onKeyPress );
	}
	
	
	// 設定
	function setConfig( setting )
	{
		if ( typeof setting != 'object' ) {
			return;
		}
		for ( key in setting ) {
			switch ( key ) {
				case 'imagesDir': // 画像ディレクトリのパス
					IMAGES_DIR = setting[ key ];
					break;
				
				case 'xsltFile': // 画像ディレクトリのパス
					XSLT_FILE = setting[ key ];
					break;
				
				case 'bodyStyle': // エディタのbodyのstyle
					BODY_STYLE += setting[ key ];
					break;
				
				case 'mathStyle': // mstyle要素のstyle
					MSTYLE_STYLE += setting[ key ];
					break;
				
				case 'changeMode': // 通常モードを使うかどうか
					enableChangeMode = setting[ key ];
					break;
				
				case 'newLine': // 改行を使うかどうか
					enableNewLine = setting[ key ];
					break;
				
				case 'suggestion': // 通常モードを使うかどうか
					useSuggestion = setting[ key ];
					break;
				
				case 'latexConversion': // XSLファイルをダウンロードするかどうか
					downloadXSL = setting[ key ];
					break;
				
				case 'toolbar': // ツールバーを使うかどうか
					useToolbar = setting[ key ];
					break;
				
				case 'fontFamily': // serifかsans-serifか
					if ( setting[ key ] == 'sans-serif' ) {
						BODY_STYLE += 'font-family:"Lucida Grande",Verdana,Arial,sans-serif;';
					}
					if ( setting[ key ] == 'serif' ) {
						BODY_STYLE += 'font-family:Georgia,"Times New Roman",Times,serif;';
					}
					break;
				
				case 'displayStyle': // 数式のdisplaystyle
					if ( setting[ key ] == true || setting[ key ] == 'true' ) {
						DISPLAYSTYLE = 'true';
					}
					else {
						DISPLAYSTYLE = 'false';
					}
					break;
			}
		}
		if ( !enableChangeMode ) {
			MATH_STYLE = 'text-align:left; margin-bottom:0.5em;';
		}
	}
	
	
	// カーソルをnodeの後に移動
	function setCursorAfter( node )
	{
		createInputtingElement();
		range.setStartAfter( node );
		range.collapse( true );
		range.insertNode( inputting );
	}
	
	
	// カーソルをnodeの中の最初の位置に移動
	function setCursorAtStartIn( node )
	{
		if ( node.firstChild
		  && node.firstChild.getAttribute( 'class' ) != 'editbox' ) {
			setCursorBefore( node.firstChild );
		}
		else {
			setCursorIn( node );
		}
	}
	
	
	// カーソルをnodeの前に移動
	function setCursorBefore( node )
	{
		createInputtingElement();
		range.setStartBefore( node );
		range.collapse( true );
		range.insertNode( inputting );
	}
	
	
	// カーソルをnodeの中に移動
	function setCursorIn( node )
	{
		createInputtingElement();
		if ( node.firstChild
		  && node.firstChild.getAttribute( 'class' ) == 'editbox' ) {
			node.firstChild.appendChild( inputting );
		}
		else {
			node.appendChild( inputting );
		}
	}
	
	
	// iframeをセット
	function setIframe()
	{
		// iframeを作成
		iframe = document.createElement( 'iframe' );
		iframe.setAttribute( 'id', id + '_iframe' );
		iframe.setAttribute( 'frameborder', 0 );
		iframe.setAttribute( 'style', 'width:100%; height:100%;' );
		
		// エディタにiframeをappend
		document.getElementById( id ).appendChild( iframe );
		
		// iframeのcontentWindowとcontentDocumentを取得
		iwindow   = getWindow();
		idocument = getDocument();
		
		// Rangeを作成
		range = getRange();
		
		// iframeのcontnetDocumentを書き込み可能な状態にする
		idocument.open();
		idocument.close();
		
		idocument.body.setAttribute( 'style', BODY_STYLE );
		
		// スペルチェックをオフに
		idocument.body.setAttribute( 'spellcheck', false );
	}
	
	
	// ツールバーを表示
	function showToolbar()
	{
		if ( document.getElementById( id + '_toolbar' ) ) {
			document.getElementById( id + '_toolbar' ).style.display = 'block';
			document.getElementById( id + '_toolbar_phantom' ).style.display = 'block';
		}
	}
	
	
	// カーソルを点滅させる
	function startBlinking()
	{
		if ( cursor ) {
			clearInterval( blinkInterval );
			cursor.setAttribute( 'style', CURSOR_STYLE );
			blinkInterval = setInterval( function () {
				if ( cursor.hasAttribute( 'style' ) ) {
					cursor.removeAttribute( 'style' );
				}
				else {
					cursor.setAttribute( 'style', CURSOR_STYLE );
				}
			}, CURSOR_BLINK_RATE );
		}
	}
	
	
	// カーソルを消す
	function stopBlinking()
	{
		if ( cursor ) {
			clearInterval( blinkInterval );
			cursor.removeAttribute( 'style' );
		}
	}
	
	
	// designMode切り替え
	function switchDesignMode( onOrOff )
	{
		if ( onOrOff == 'on') {
			if ( idocument.designMode ) {
				idocument.designMode = 'on';
			}
			else {
				idocument.body.contentEditable = true;
			}
		}
		else if ( onOrOff == 'off') {
			if ( idocument.designMode ) {
				idocument.designMode = 'off';
			}
			else {
				idocument.body.contentEditable = false;
			}
		}
		
		window.focus();
		iwindow.focus();
	}
	
	
	// Mathモード切り替え
	function switchMathMode( onOrOff )
	{
		// 数式モードにする
		if ( onOrOff == 'on' ) {
			isMathMode = true;
			
			switchDesignMode( 'off' );
		}
		
		// 通常モードにする
		else if ( onOrOff == 'off' ) {
			
			if ( !enableChangeMode ) { return; }
			
			isMathMode = false;
			
			completeConversion();
			stopBlinking();
			if ( selectedNodes ) {
				selectedNodes.removeAttribute( 'style' );
				selectedNodes = null;
			}
			if ( currentGroup ) {
				currentGroup.removeAttribute( 'style' );
				currentGroup = null;
			}
			
			// designModeをオンにしてRange取得（ここでWebKitブラウザに問題あり）
			switchDesignMode( 'on' );
			range = getRange();
			
			// 現在入っているmath要素を取得
			var math = Suim.util.searchAncestorByTagName( 'math', inputting );
			
			// 通常モードのためのテキストノードを用意
			var textNode = idocument.createTextNode( '' );
			
			// 行のはじめの場合
			if ( !inputting.previousSibling && inputting.parentNode.nodeName == 'mstyle'
			  && Suim.util.getNodeNumber( math ) == 0 ) {
				
				// previousSiblingがテキストノードである場合
				if ( math.parentNode.previousSibling
				  && math.parentNode.previousSibling.nodeType == math.parentNode.previousSibling.TEXT_NODE ) {
					range.setStart( math.parentNode.previousSibling, math.parentNode.previousSibling.length );
					range.collapse( true );
					insertNodeAtSelection( textNode );
				}
				
				// previousSiblingがない，あるいはテキストノードではない場合
				else {
					// 新しいテキストノードを作成してそこにカーソルを移動する
					range.setStartBefore( math.parentNode ); range.collapse( true );
					range.insertNode( textNode );
					range.setStart( textNode, 0 ); range.collapse( true );
				}
			}
			// 行の途中または最後の場合
			else {
				
				// nextSiblingがテキストノードである場合
				if ( math.parentNode.nextSibling
				  && math.parentNode.nextSibling.nodeType == math.parentNode.nextSibling.TEXT_NODE ) {
					range.setStart( math.parentNode.nextSibling, 0 ); // WebKitだとこれが効かない
					range.collapse( true );
					insertNodeAtSelection( textNode );
				}
				
				// nextSiblingがない，あるいはテキストノードではない場合
				else {
					// 新しいテキストノードを作成してそこにカーソルを移動する
					range.setStartAfter( math.parentNode ); range.collapse( true );
					range.insertNode( textNode );
					range.setStart( textNode, 0 ); range.collapse( true );
				}
			}
			
			// 空の行があったら削除
			if ( math.firstChild.childNodes.length == 1 && math.firstChild.firstChild == inputting ) {
				if ( math.parentNode.childNodes.length == 1 ) {
					math.parentNode.parentNode.removeChild( math.parentNode );
				}
				else {
					math.parentNode.removeChild( math );
				}
			}
			
			// inputting要素を削除
			inputting.parentNode.removeChild( inputting );
		}
		
		if ( useToolbar ) {
			// Toolbarの内容を入れかえる
			if ( document.getElementById( id + '_toolbar' ) ) {
				if ( isMathMode ) {
					document.getElementById( id + '_math_tools' ).style.display = 'inline';
					document.getElementById( id + '_tools' ).style.display = 'none';
					document.getElementById( id + '_toolbar' ).style.backgroundColor = '#6D84B4';
				}
				if ( !isMathMode ) {
					document.getElementById( id + '_math_tools' ).style.display = 'none';
					document.getElementById( id + '_tools' ).style.display = 'inline';
					document.getElementById( id + '_toolbar' ).style.backgroundColor = '#969696';
				}
			}
		}
	}
	
	
	// 数式モードをトグルする
	function toggleMathMode()
	{
		// 数式モード => 通常モード
		if ( isMathMode ) {
			switchMathMode( 'off' );
		}
		
		// 通常モード => 数式モード
		else {
			var span = idocument.createElement( 'span' );
			var math = createNewMathElement();
			span.setAttribute( 'class', 'math' );
			span.setAttribute( 'style', MATH_SPAN_STYLE );
			span.appendChild( math );
			setCursorIn( math.firstChild );
			insertNodeAtSelection( span );
			switchMathMode( 'on' );
		}
	}
	
	
	// 子要素をそれぞれmrowで囲む
	function wrapChildNodes( node )
	{
		if ( !node.hasChildNodes() ) {
			return;
		}
		else {
			var childNodes = node.childNodes;
			
			if ( childNodes.length == 1 ) {
				var mdata = node.firstChild;
				var mrow = createMathmlElement( 'mrow' );
				mrow.appendChild( mdata );
				range.selectNodeContents( node );
				range.deleteContents();
				node.appendChild( mrow ); node.appendChild( mrow );
				return mrow;
			}
			else if ( childNodes.length == 2 ) {
				var mdata1 = node.firstChild;
				var mdata2 = node.lastChild;
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				mrow1.appendChild( mdata1 ); mrow2.appendChild( mdata2 );
				range.selectNodeContents( node );
				range.deleteContents();
				node.appendChild( mrow1 ); node.appendChild( mrow2 );
				return [ mrow1, mrow2 ];
			}
			else if ( childNodes.length == 3 ) {
				var mdata1 = node.childNodes[ 0 ];
				var mdata2 = node.childNodes[ 1 ];
				var mdata3 = node.childNodes[ 2 ];
				var mrow1 = createMathmlElement( 'mrow' );
				var mrow2 = createMathmlElement( 'mrow' );
				var mrow3 = createMathmlElement( 'mrow' );
				mrow1.appendChild( mdata1 ); mrow2.appendChild( mdata2 ); mrow3.appendChild( mdata3 );
				range.selectNodeContents( node );
				range.deleteContents();
				node.appendChild( mrow1 ); node.appendChild( mrow2 ); node.appendChild( mrow3 );
				return [ mrow1, mrow2, mrow3 ];
			}
			else {
				return;
			}
		}
	}
	
}


// バージョン
Suim.version = '0.1';


// LaTeX変換用XSLT
Suim.xslt = null;


// ユーティリティ関数
Suim.util = {
	
	// イベントリスナ追加
	addEventListener: function ( node, event, func )
	{
		if ( node.addEventListener ) {
			node.addEventListener( event, func, false );
		}
		else {
			node.attachEvent( 'on' + event, func );
		}
	},
	
	// テキストノードの文字列を抜き出す
	extractText: function ( node )
	{
		var childNodes = node.childNodes;
		var text = '';
		for ( var i = 0; i < childNodes.length; i++ ) {
			if ( childNodes[ i ].nodeType == childNodes[ i ].TEXT_NODE ) {
				text += childNodes[ i ].nodeValue;
			}
			else {
				text += Suim.util.extractText( childNodes[ i ] );
			}
		}
		return text;
	},
	
	// 何番目の子ノードか調べる
	getNodeNumber: function ( node )
	{
		for ( var i = 0; i < node.parentNode.childNodes.length; i++ ) {
			if ( node.parentNode.childNodes[ i ] == node) { return i; }
		}
		return -1;
	},
	
	// 要素の位置を取得
	getPosition: function ( node ) {
		var top = 0;
		var left = 0;
		while ( node ) {
			left += node.offsetLeft;
			top += node.offsetTop;
			node = node.offsetParent;
		}
		return {left : left, top : top};
	},
	
	// 括弧を削除
	removeBrackets: function ( node )
	{
		if ( !node ) { return; }
		
		if ( node.nodeName == 'mfenced' ) {
			return node.firstChild;
		}
		else {
			return node;
		}
	},
	
	// 空白除去
	removeCharsAndBlanks: function ( str, n ) {
		var s = str.slice( n );
		for ( var i = 0; i < s.length && s.charCodeAt(i) <= 32; i++ );
		return s.slice( i );
	},
	
	// Mozillaの独自属性を削除
	removeMozillaAttribute: function ( target )
	{
		var childNodes = target.childNodes;
		for ( var i = 0; i < childNodes.length; i++ ) {
			if ( childNodes[ i ].nodeType == childNodes[ i ].ELEMENT_NODE
			  && childNodes[ i ].hasAttribute( '_moz_dirty' ) ) {
				childNodes[ i ].removeAttribute( '_moz_dirty' );
			}
			if ( childNodes[ i ].firstChild ) {
				Suim.util.removeMozillaAttribute( childNodes[ i ] );
			}
		}
	},
	
	// target要素の先祖でtag名がtagNameの要素を探す
	searchAncestorByTagName: function ( tagName, target )
	{
		if ( !( target.parentNode ) ) {
			return false;
		}
		if ( target.parentNode.nodeName == tagName ) {
			return target.parentNode;
		}
		else {
			return Suim.util.searchAncestorByTagName( tagName, target.parentNode );
		}
	},
	
	// target要素の先祖でclass名がclassNameの要素を探す
	searchAncestorByClassName: function ( className, target )
	{
		if ( !( target.parentNode ) ) {
			return false;
		}
		if ( target.parentNode.getAttribute ) {
			if ( target.parentNode.getAttribute( 'class' ) == className ) {
				return target.parentNode;
			}
			else {
				return Suim.util.searchAncestorByClassName( className, target.parentNode );
			}
		}
		else {
			return Suim.util.searchAncestorByClassName( className, target.parentNode );
		}
	},
	
	// target要素の子孫でid名がidNameの要素を探す
	searchDescendantById: function ( idName, target )
	{
		var childNodes = target.childNodes;
		for ( var i = 0; i < childNodes.length; i++ ) {
			if ( childNodes[ i ].nodeType != childNodes[ i ].ELEMENT_NODE ) {
				continue;
			}
			if ( childNodes[ i ].getAttribute( 'id' ) == idName ) {
				return childNodes[ i ];
			}
			var ret = Suim.util.searchDescendantById( idName, childNodes[ i ] );
			if ( ret ) {
				return ret;
			}
		}
		return null;
	},
	
	// 左括弧を探す
	searchLeftFence: function ( fence, target ) {
		if ( !( target.previousSibling ) ) {
			return false;
		}
		if ( target.previousSibling.nodeName == 'mo' ) {
			if ( target.previousSibling.firstChild.nodeValue == fence ) {
				return target.previousSibling;
			}
			else {
				return Suim.util.searchLeftFence( fence, target.previousSibling );
			}
		}
		else {
			return Suim.util.searchLeftFence( fence, target.previousSibling );
		}
	},
	
	// 右括弧を探す
	searchRightFence: function ( fence, target ) {
		if ( !( target.nextSibling ) ) {
			return false;
		}
		if ( target.nextSibling.nodeName == 'mo' ) {
			if ( target.nextSibling.firstChild.nodeValue == fence ) {
				return target.nextSibling;
			}
			else {
				return Suim.util.searchRightFence( fence, target.nextSibling );
			}
		}
		else {
			return Suim.util.searchRightFence( fence, target.nextSibling );
		}
	}
};


// ブラウザ確認
Suim.browser = {
	
	getBrowserName: function () {
		if ( /opera/i.test( navigator.userAgent ) ) return 'Opera';
		else if ( /msie/i.test( navigator.userAgent ) ) return 'Internet Explorer';
		else if ( /chrome/i.test( navigator.userAgent ) ) return 'Google Chrome';
		else if ( /safari/i.test( navigator.userAgent ) ) return 'Safari';
		else if ( /firefox/i.test( navigator.userAgent ) ) return 'Firefox';
		else if ( /gecko/i.test( navigator.userAgent ) ) return 'Gecko';
		else return navigator.userAgent;
	},
	
	getBrowserDetail: function () {
		return navigator.userAgent;
	},
	
	isIE: function () {
		return Suim.browser.getBrowserName() == 'Internet Explorer';
	},
	
	isIE6: function () {
		if ( /msie 6/i.test( navigator.userAgent ) ) return true;
		else false;
	},
	
	isIE7: function () {
		if( /msie 7/i.test( navigator.userAgent ) ) return true;
		else false;
	},
	
	isIE8: function () {
		if ( /msie 7/i.test( navigator.userAgent ) ) return true;
		else false;
	},
	
	isFF: function () {
		return Suim.browser.getBrowserName() == 'Firefox';
	},
	
	isFF2: function () {
		if ( /firefox\/2/i.test( navigator.userAgent ) ) return true;
		else false;
	},
	
	isFF3: function () {
		if ( /firefox\/3/i.test( navigator.userAgent ) ) return true;
		else false;
	},
	
	isSafari: function () {
		return Suim.browser.getBrowserName() == 'Safari';
	},
	
	isOpera: function () {
		return Suim.browser.getBrowserName() == 'Opera';
	},
	
	isChrome: function () {
		return Suim.browser.getBrowserName() == "Google Chrome";
	},
	
	isGecko: function () {
		return Suim.browser.getBrowserName() == "Gecko";
	}
};
