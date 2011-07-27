Suim.symbol = (function()
{
	var CONSTANT = 0;
	var UNARY = 1;
	var BINARY = 2;
	var INFIX = 3;
	var UNDEROVER = 4;
	var LEFTBRACKET = 5;
	var RIGHTBRACKET = 6;
	var SPACE = 7;
	var TEXT = 8;
	var ALIAS = 9;
	var SUBSCRIPT = 10;
	var SUPERSCRIPT = 11;
	var VECTOR = 12;
	var MATRIX = 13;
	var SIMULEQUATIONS = 14;
	var SENTENCE = 15;
	
	var symbols = [
	
	// LaTeX Notation
	
	// Greek Letters
	{ input:"alpha", output:"\u03B1", tag:"mi", type:CONSTANT },
	{ input:"beta", output:"\u03B2", tag:"mi", type:CONSTANT },
	{ input:"gamma", output:"\u03B3", tag:"mi", type:CONSTANT },
	{ input:"delta", output:"\u03B4", tag:"mi", type:CONSTANT },
	{ input:"epsilon", output:"\u03B5", tag:"mi", type:CONSTANT },
	{ input:"varepsilon", output:"\u025B", tag:"mi", type:CONSTANT },
	{ input:"zeta", output:"\u03B6", tag:"mi", type:CONSTANT },
	{ input:"eta", output:"\u03B7", tag:"mi", type:CONSTANT },
	{ input:"theta", output:"\u03B8", tag:"mi", type:CONSTANT },
	{ input:"vartheta", output:"\u03D1", tag:"mi", type:CONSTANT },
	{ input:"iota", output:"\u03B9", tag:"mi", type:CONSTANT },
	{ input:"kappa", output:"\u03BA", tag:"mi", type:CONSTANT },
	{ input:"lambda", output:"\u03BB", tag:"mi", type:CONSTANT },
	{ input:"mu", output:"\u03BC", tag:"mi", type:CONSTANT },
	{ input:"nu", output:"\u03BD", tag:"mi", type:CONSTANT },
	{ input:"xi", output:"\u03BE", tag:"mi", type:CONSTANT },
	{ input:"pi", output:"\u03C0", tag:"mi", type:CONSTANT },
	{ input:"varpi", output:"\u03D6", tag:"mi", type:CONSTANT },
	{ input:"rho", output:"\u03C1", tag:"mi", type:CONSTANT },
	{ input:"varrho", output:"\u03F1", tag:"mi", type:CONSTANT },
	{ input:"varsigma", output:"\u03C2", tag:"mi", type:CONSTANT },
	{ input:"sigma", output:"\u03C3", tag:"mi", type:CONSTANT },
	{ input:"tau", output:"\u03C4", tag:"mi", type:CONSTANT },
	{ input:"upsilon", output:"\u03C5", tag:"mi", type:CONSTANT },
	{ input:"phi", output:"\u03C6", tag:"mi", type:CONSTANT },
	{ input:"varphi", output:"\u03D5", tag:"mi", type:CONSTANT },
	{ input:"chi", output:"\u03C7", tag:"mi", type:CONSTANT },
	{ input:"psi", output:"\u03C8", tag:"mi", type:CONSTANT },
	{ input:"omega", output:"\u03C9", tag:"mi", type:CONSTANT },
	{ input:"Gamma", output:"\u0393", tag:"mo", type:CONSTANT },
	{ input:"Delta", output:"\u0394", tag:"mo", type:CONSTANT },
	{ input:"Theta", output:"\u0398", tag:"mo", type:CONSTANT },
	{ input:"Lambda", output:"\u039B", tag:"mo", type:CONSTANT },
	{ input:"Xi", output:"\u039E", tag:"mo", type:CONSTANT },
	{ input:"Pi", output:"\u03A0", tag:"mo", type:CONSTANT },
	{ input:"Sigma", output:"\u03A3", tag:"mo", type:CONSTANT },
	{ input:"Upsilon", output:"\u03A5", tag:"mo", type:CONSTANT },
	{ input:"Phi", output:"\u03A6", tag:"mo", type:CONSTANT },
	{ input:"Psi", output:"\u03A8", tag:"mo", type:CONSTANT },
	{ input:"Omega", output:"\u03A9", tag:"mo", type:CONSTANT },
	
	// Binary Operation Symbols
	{ input:"pm", output:"\u00B1", tag:"mo", type:CONSTANT },
	{ input:"mp", output:"\u2213", tag:"mo", type:CONSTANT },
	{ input:"triangleleft", output:"\u22B2", tag:"mo", type:CONSTANT },
	{ input:"triangleright", output:"\u22B3", tag:"mo", type:CONSTANT },
	{ input:"cdot", output:"\u22C5", tag:"mo", type:CONSTANT },
	{ input:"star", output:"\u22C6", tag:"mo", type:CONSTANT },
	{ input:"ast", output:"\u002A", tag:"mo", type:CONSTANT },
	{ input:"times", output:"\u00D7", tag:"mo", type:CONSTANT },
	{ input:"div", output:"\u00F7", tag:"mo", type:CONSTANT },
	{ input:"circ", output:"\u2218", tag:"mo", type:CONSTANT },
	//{ input:"bullet", output:"\u2219", tag:"mo", type:CONSTANT },
	{ input:"bullet", output:"\u2022", tag:"mo", type:CONSTANT },
	{ input:"oplus", output:"\u2295", tag:"mo", type:CONSTANT },
	{ input:"ominus", output:"\u2296", tag:"mo", type:CONSTANT },
	{ input:"otimes", output:"\u2297", tag:"mo", type:CONSTANT },
	{ input:"bigcirc", output:"\u25CB", tag:"mo", type:CONSTANT },
	{ input:"oslash", output:"\u2298", tag:"mo", type:CONSTANT },
	{ input:"odot", output:"\u2299", tag:"mo", type:CONSTANT },
	{ input:"land", output:"\u2227", tag:"mo", type:CONSTANT },
	{ input:"wedge", output:"\u2227", tag:"mo", type:CONSTANT },
	{ input:"lor", output:"\u2228", tag:"mo", type:CONSTANT },
	{ input:"vee", output:"\u2228", tag:"mo", type:CONSTANT },
	{ input:"cap", output:"\u2229", tag:"mo", type:CONSTANT },
	{ input:"cup", output:"\u222A", tag:"mo", type:CONSTANT },
	{ input:"sqcap", output:"\u2293", tag:"mo", type:CONSTANT },
	{ input:"sqcup", output:"\u2294", tag:"mo", type:CONSTANT },
	{ input:"uplus", output:"\u228E", tag:"mo", type:CONSTANT },
	{ input:"amalg", output:"\u2210", tag:"mo", type:CONSTANT },
	{ input:"bigtriangleup", output:"\u25B3", tag:"mo", type:CONSTANT },
	{ input:"bigtriangledown", output:"\u25BD", tag:"mo", type:CONSTANT },
	{ input:"dag", output:"\u2020", tag:"mo", type:CONSTANT },
	{ input:"dagger", output:"\u2020", tag:"mo", type:CONSTANT },
	{ input:"ddag", output:"\u2021", tag:"mo", type:CONSTANT },
	{ input:"ddagger", output:"\u2021", tag:"mo", type:CONSTANT },
	{ input:"lhd", output:"\u22B2", tag:"mo", type:CONSTANT },
	{ input:"rhd", output:"\u22B3", tag:"mo", type:CONSTANT },
	{ input:"unlhd", output:"\u22B4", tag:"mo", type:CONSTANT },
	{ input:"unrhd", output:"\u22B5", tag:"mo", type:CONSTANT },
	
	// BIG Operators
	{ input:"sum", output:"\u2211", tag:"mo", type:UNDEROVER},
	{ input:"prod", output:"\u220F", tag:"mo", type:UNDEROVER},
	{ input:"bigcap", output:"\u22C2", tag:"mo", type:UNDEROVER},
	{ input:"bigcup", output:"\u22C3", tag:"mo", type:UNDEROVER},
	{ input:"bigwedge", output:"\u22C0", tag:"mo", type:UNDEROVER},
	{ input:"bigvee", output:"\u22C1", tag:"mo", type:UNDEROVER},
	{ input:"bigsqcap", output:"\u2A05", tag:"mo", type:UNDEROVER},
	{ input:"bigsqcup", output:"\u2A06", tag:"mo", type:UNDEROVER},
	{ input:"coprod", output:"\u2210", tag:"mo", type:UNDEROVER},
	{ input:"bigoplus", output:"\u2A01", tag:"mo", type:UNDEROVER},
	{ input:"bigotimes", output:"\u2A02", tag:"mo", type:UNDEROVER},
	{ input:"bigodot", output:"\u2A00", tag:"mo", type:UNDEROVER},
	{ input:"biguplus", output:"\u2A04", tag:"mo", type:UNDEROVER},
	{ input:"int", output:"\u222B", tag:"mo", type:CONSTANT },
	{ input:"oint", output:"\u222E", tag:"mo", type:CONSTANT },
	
	// Binary Relation Symbols
	{ input:":=", output:":=", tag:"mo", type:CONSTANT },
	{ input:"lt", output:"<", tag:"mo", type:CONSTANT },
	{ input:"gt", output:">", tag:"mo", type:CONSTANT },
	{ input:"ne", output:"\u2260", tag:"mo", type:CONSTANT },
	{ input:"neq", output:"\u2260", tag:"mo", type:CONSTANT },
	{ input:"le", output:"\u2264", tag:"mo", type:CONSTANT },
	{ input:"leq", output:"\u2264", tag:"mo", type:CONSTANT },
	{ input:"leqslant", output:"\u2264", tag:"mo", type:CONSTANT },
	{ input:"ge", output:"\u2265", tag:"mo", type:CONSTANT },
	{ input:"geq", output:"\u2265", tag:"mo", type:CONSTANT },
	{ input:"geqslant", output:"\u2265", tag:"mo", type:CONSTANT },
	{ input:"equiv", output:"\u2261", tag:"mo", type:CONSTANT },
	{ input:"ll", output:"\u226A", tag:"mo", type:CONSTANT },
	{ input:"gg", output:"\u226B", tag:"mo", type:CONSTANT },
	{ input:"doteq", output:"\u2250", tag:"mo", type:CONSTANT },
	{ input:"prec", output:"\u227A", tag:"mo", type:CONSTANT },
	{ input:"succ", output:"\u227B", tag:"mo", type:CONSTANT },
	{ input:"preceq", output:"\u227C", tag:"mo", type:CONSTANT },
	{ input:"succeq", output:"\u227D", tag:"mo", type:CONSTANT },
	{ input:"subset", output:"\u2282", tag:"mo", type:CONSTANT },
	{ input:"supset", output:"\u2283", tag:"mo", type:CONSTANT },
	{ input:"subseteq", output:"\u2286", tag:"mo", type:CONSTANT },
	{ input:"supseteq", output:"\u2287", tag:"mo", type:CONSTANT },
	{ input:"sqsubset", output:"\u228F", tag:"mo", type:CONSTANT },
	{ input:"sqsupset", output:"\u2290", tag:"mo", type:CONSTANT },
	{ input:"sqsubseteq", output:"\u2291", tag:"mo", type:CONSTANT },
	{ input:"sqsupseteq", output:"\u2292", tag:"mo", type:CONSTANT },
	{ input:"sim", output:"\u223C", tag:"mo", type:CONSTANT },
	{ input:"simeq", output:"\u2243", tag:"mo", type:CONSTANT },
	{ input:"approx", output:"\u2248", tag:"mo", type:CONSTANT },
	{ input:"cong", output:"\u2245", tag:"mo", type:CONSTANT },
	{ input:"Join", output:"\u22C8", tag:"mo", type:CONSTANT },
	{ input:"bowtie", output:"\u22C8", tag:"mo", type:CONSTANT },
	{ input:"in", output:"\u2208", tag:"mo", type:CONSTANT },
	{ input:"ni", output:"\u220B", tag:"mo", type:CONSTANT },
	{ input:"owns", output:"\u220B", tag:"mo", type:CONSTANT },
	{ input:"propto", output:"\u221D", tag:"mo", type:CONSTANT },
	{ input:"vdash", output:"\u22A2", tag:"mo", type:CONSTANT },
	{ input:"dashv", output:"\u22A3", tag:"mo", type:CONSTANT },
	{ input:"models", output:"\u22A8", tag:"mo", type:CONSTANT },
	{ input:"perp", output:"\u22A5", tag:"mo", type:CONSTANT },
	{ input:"smile", output:"\u2323", tag:"mo", type:CONSTANT },
	{ input:"frown", output:"\u2322", tag:"mo", type:CONSTANT },
	{ input:"asymp", output:"\u224D", tag:"mo", type:CONSTANT },
	{ input:"notin", output:"\u2209", tag:"mo", type:CONSTANT },
	{ input:"lfloor", tag:"mo", output:"\u230A", tex:"lfloor", type:CONSTANT },
	{ input:"rfloor", tag:"mo", output:"\u230B", tex:"rfloor", type:CONSTANT },
	{ input:"lceiling", tag:"mo", output:"\u2308", tex:"lceiling", type:CONSTANT },
	{ input:"rceiling", tag:"mo", output:"\u2309", tex:"rceiling", type:CONSTANT },
	
	// Miscellaneous Symbols
	{ input:"prime", output:"\u2032", tag:"mo", type:CONSTANT },
	{ input:"'", output:"\u02B9", tag:"mo", type:CONSTANT },
	{ input:"''", output:"\u02BA", tag:"mo", type:CONSTANT },
	{ input:"'''", output:"\u2034", tag:"mo", type:CONSTANT },
	{ input:"''''", output:"\u2057", tag:"mo", type:CONSTANT },
	{ input:"ldots", output:"\u2026", tag:"mo", type:CONSTANT },
	{ input:"cdots", output:"\u22EF", tag:"mo", type:CONSTANT },
	{ input:"vdots", output:"\u22EE", tag:"mo", type:CONSTANT },
	{ input:"ddots", output:"\u22F1", tag:"mo", type:CONSTANT },
	{ input:"forall", output:"\u2200", tag:"mo", type:CONSTANT },
	{ input:"exists", output:"\u2203", tag:"mo", type:CONSTANT },
	{ input:"Re", output:"\u211C", tag:"mo", type:CONSTANT },
	{ input:"Im", output:"\u2111", tag:"mo", type:CONSTANT },
	{ input:"aleph", output:"\u2135", tag:"mo", type:CONSTANT },
	{ input:"hbar", output:"\u210F", tag:"mo", type:CONSTANT },
	{ input:"ell", output:"\u2113", tag:"mo", type:CONSTANT },
	{ input:"wp", output:"\u2118", tag:"mo", type:CONSTANT },
	{ input:"emptyset", output:"\u2205", tag:"mo", type:CONSTANT },
	{ input:"infty", output:"\u221E", tag:"mo", type:CONSTANT },
	{ input:"partial", output:"\u2202", tag:"mo", type:CONSTANT },
	{ input:"nabla", output:"\u2207", tag:"mo", type:CONSTANT },
	{ input:"triangle", output:"\u25B3", tag:"mo", type:CONSTANT },
	{ input:"therefore", output:"\u2234", tag:"mo", type:CONSTANT },
	{ input:"angle", output:"\u2220", tag:"mo", type:CONSTANT },
	{ input:"diamond", output:"\u22C4", tag:"mo", type:CONSTANT },
	//{ input:"Diamond", output:"\u25CA", tag:"mo", type:CONSTANT },
	{ input:"Diamond", output:"\u25C7", tag:"mo", type:CONSTANT },
	{ input:"neg", output:"\u00AC", tag:"mo", type:CONSTANT },
	{ input:"lnot", output:"\u00AC", tag:"mo", type:CONSTANT },
	{ input:"bot", output:"\u22A5", tag:"mo", type:CONSTANT },
	{ input:"top", output:"\u22A4", tag:"mo", type:CONSTANT },
	{ input:"square", output:"\u25AB", tag:"mo", type:CONSTANT },
	{ input:"Box", output:"\u25A1", tag:"mo", type:CONSTANT },
	{ input:"wr", output:"\u2240", tag:"mo", type:CONSTANT },
	
	// Standard Functions
	{ input:"arccos", output:"arccos", tag:"mo", type:UNARY, func:true },
	{ input:"arcsin", output:"arcsin", tag:"mo", type:UNARY, func:true },
	{ input:"arctan", output:"arctan", tag:"mo", type:UNARY, func:true },
	{ input:"arg", output:"arg", tag:"mo", type:UNARY, func:true },
	{ input:"cos", output:"cos", tag:"mo", type:UNARY, func:true },
	{ input:"cosh", output:"cosh", tag:"mo", type:UNARY, func:true },
	{ input:"cot", output:"cot", tag:"mo", type:UNARY, func:true },
	{ input:"coth", output:"coth", tag:"mo", type:UNARY, func:true },
	{ input:"csc", output:"csc", tag:"mo", type:UNARY, func:true },
	{ input:"deg", output:"deg", tag:"mo", type:UNARY, func:true },
	{ input:"det", output:"det", tag:"mo", type:UNARY, func:true },
	{ input:"dim", output:"dim", tag:"mo", type:UNARY, func:true }, //CONSTANT?
	{ input:"exp", output:"exp", tag:"mo", type:UNARY, func:true },
	{ input:"gcd", output:"gcd", tag:"mo", type:UNARY, func:true }, //CONSTANT?
	{ input:"hom", output:"hom", tag:"mo", type:UNARY, func:true },
	{ input:"inf", output:"inf", tag:"mo", type:UNDEROVER },
	{ input:"ker", output:"ker", tag:"mo", type:UNARY, func:true },
	{ input:"lg", output:"lg", tag:"mo", type:UNARY, func:true },
	{ input:"lim", output:"lim", tag:"mo", type:UNDEROVER },
	{ input:"liminf", output:"liminf", tag:"mo", type:UNDEROVER },
	{ input:"limsup", output:"limsup", tag:"mo", type:UNDEROVER },
	{ input:"ln", output:"ln", tag:"mo", type:UNARY, func:true },
	{ input:"log", output:"log", tag:"mo", type:UNARY, func:true },
	{ input:"max", output:"max", tag:"mo", type:UNDEROVER },
	{ input:"min", output:"min", tag:"mo", type:UNDEROVER },
	{ input:"Pr", output:"Pr", tag:"mo", type:UNARY, func:true },
	{ input:"sec", output:"sec", tag:"mo", type:UNARY, func:true },
	{ input:"sin", output:"sin", tag:"mo", type:UNARY, func:true },
	{ input:"sinh", output:"sinh", tag:"mo", type:UNARY, func:true },
	{ input:"sup", output:"sup", tag:"mo", type:UNDEROVER },
	{ input:"tan", output:"tan", tag:"mo", type:UNARY, func:true },
	{ input:"tanh", output:"tanh", tag:"mo", type:UNARY, func:true },
	
	// Arrows
	{ input:"gets", output:"\u2190", tag:"mo", type:CONSTANT },
	{ input:"leftarrow", output:"\u2190", tag:"mo", type:CONSTANT },
	{ input:"to", output:"\u2192", tag:"mo", type:CONSTANT },
	{ input:"rightarrow", output:"\u2192", tag:"mo", type:CONSTANT },
	{ input:"leftrightarrow", output:"\u2194", tag:"mo", type:CONSTANT },
	{ input:"uparrow", output:"\u2191", tag:"mo", type:CONSTANT },
	{ input:"downarrow", output:"\u2193", tag:"mo", type:CONSTANT },
	{ input:"updownarrow", output:"\u2195", tag:"mo", type:CONSTANT },
	{ input:"Leftarrow", output:"\u21D0", tag:"mo", type:CONSTANT },
	{ input:"Rightarrow", output:"\u21D2", tag:"mo", type:CONSTANT },
	{ input:"Leftrightarrow", output:"\u21D4", tag:"mo", type:CONSTANT },
	{ input:"iff", output:"\u21D4", tag:"mo", type:CONSTANT },
	{ input:"Uparrow", output:"\u21D1", tag:"mo", type:CONSTANT },
	{ input:"Downarrow", output:"\u21D3", tag:"mo", type:CONSTANT },
	{ input:"Updownarrow", output:"\u21D5", tag:"mo", type:CONSTANT },
	{ input:"mapsto", output:"\u21A6", tag:"mo", type:CONSTANT },
	{ input:"rightarrowtail", output:"\u21A3", tag:"mo", type:CONSTANT },
	{ input:"twoheadrightarrow", output:"\u21A0", tag:"mo", type:CONSTANT },
	{ input:"twoheadrightarrowtail", output:"\u2916", tag:"mo", type:CONSTANT },
	
	// Grouping Brackets
	{ input:"(", output:"(", tag:"mo", type:LEFTBRACKET },
	{ input:")", output:")", tag:"mo", type:RIGHTBRACKET },
	{ input:"[", output:"[", tag:"mo", type:LEFTBRACKET },
	{ input:"]", output:"]", tag:"mo", type:RIGHTBRACKET },
	{ input:"{", output:"{", tag:"mo", type:LEFTBRACKET },
	{ input:"}", output:"}", tag:"mo", type:RIGHTBRACKET },
	{ input:"|", output:"|", tag:"mo", type:LEFTBRACKET },
	{ input:"langle", output:"\u2329", tag:"mo", type:LEFTBRACKET },
	{ input:"rangle", output:"\u232A", tag:"mo", type:RIGHTBRACKET },
	
	// Commands With Argument
	{ input:"sqrt", output:"sqrt", tag:"msqrt", type:UNARY },
	// { input:"root", output:"root", tag:"mroot", type:BINARY },
	{ input:"root", output:"sqrt", type:ALIAS },
	{ input:"frac", output:"frac", tag:"mfrac", type:BINARY },
	{ input:"stackrel", output:"stackrel", tag:"mover", type:BINARY },
	{ input:"_", output:"_", tag:"msub", type:INFIX },
	{ input:"^", output:"^", tag:"msup", type:INFIX },
	{ input:"mathrm", output:"mathrm", tag:"mtext", type:TEXT },
	{ input:"textrm", output:"textrm", tag:"mtext", type:TEXT },
	{ input:"mbox", output:"mbox", tag:"mtext", type:TEXT },
	
	// Diacritical Marks
	{ input:"acute", output:"\u00B4", tag:"mover", type:UNARY, acc:true },
	//{ input:"acute", output:"\u0317", tag:"mover", type:UNARY, acc:true },
	//{ input:"acute", output:"\u0301", tag:"mover", type:UNARY, acc:true },
	//{ input:"grave", output:"\u0300", tag:"mover", type:UNARY, acc:true },
	//{ input:"grave", output:"\u0316", tag:"mover", type:UNARY, acc:true },
	{ input:"grave", output:"\u0060", tag:"mover", type:UNARY, acc:true },
	{ input:"breve", output:"\u02D8", tag:"mover", type:UNARY, acc:true },
	{ input:"check", output:"\u02C7", tag:"mover", type:UNARY, acc:true },
	{ input:"dot", output:".", tag:"mover", type:UNARY, acc:true },
	{ input:"ddot", output:"..", tag:"mover", type:UNARY, acc:true },
	//{ input:"ddot", tag:"mover", output:"\u00A8", tag:"mover", type:UNARY, acc:true },
	{ input:"mathring", output:"\u00B0", tag:"mover", type:UNARY, acc:true },
	{ input:"vec", output:"\u20D7", tag:"mover", type:UNARY, acc:true },
	{ input:"overrightarrow", output:"\u20D7", tag:"mover", type:UNARY, acc:true },
	{ input:"overleftarrow", output:"\u20D6", tag:"mover", type:UNARY, acc:true },
	{ input:"hat", output:"\u005E", tag:"mover", type:UNARY, acc:true },
	{ input:"widehat", output:"\u0302", tag:"mover", type:UNARY, acc:true },
	{ input:"tilde", output:"~", tag:"mover", type:UNARY, acc:true },
	//{ input:"tilde", output:"\u0303", tag:"mover", type:UNARY, acc:true },
	{ input:"widetilde", output:"\u02DC", tag:"mover", type:UNARY, acc:true },
	{ input:"bar", output:"\u203E", tag:"mover", type:UNARY, acc:true },
	{ input:"overbrace", output:"\u23B4", tag:"mover", type:UNARY, acc:true },
	{ input:"overline", output:"\u00AF", tag:"mover", type:UNARY, acc:true },
	{ input:"underbrace", output:"\u23B5", tag:"munder", type:UNARY, acc:true },
	{ input:"underline", output:"\u00AF", tag:"munder", type:UNARY, acc:true },
	//{ input:"underline", output:"\u0332", tag:"munder", type:UNARY, acc:true },
	
	// Typestyles And Fonts
	{ input:"displaystyle", output:"displaystyle", tag:"mstyle", atname:"displaystyle", atval:"true", type:UNARY },
	{ input:"textstyle", output:"textstyle", tag:"mstyle", atname:"displaystyle", atval:"false", type:UNARY },
	{ input:"scriptstyle", output:"scriptstyle", tag:"mstyle", atname:"scriptlevel", atval:"1", type:UNARY },
	{ input:"scriptscriptstyle", output:"scriptscriptstyle", tag:"mstyle", atname:"scriptlevel", atval:"2", type:UNARY },
	{ input:"mathbf", output:"mathbf", tag:"mstyle", atname:"mathvariant", atval:"bold", type:UNARY },
	{ input:"textbf", output:"textbf", tag:"mstyle", atname:"mathvariant", atval:"bold", type:UNARY },
	{ input:"mathit", output:"mathit", tag:"mstyle", atname:"mathvariant", atval:"italic", type:UNARY },
	{ input:"textit", output:"textit", tag:"mstyle", atname:"mathvariant", atval:"italic", type:UNARY },
	{ input:"mathtt", output:"mathtt", tag:"mstyle", atname:"mathvariant", atval:"monospace", type:UNARY },
	{ input:"texttt", output:"texttt", tag:"mstyle", atname:"mathvariant", atval:"monospace", type:UNARY },
	{ input:"mathsf", output:"mathsf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", type:UNARY },
	{ input:"mathbb", output:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", type:UNARY },
	{ input:"mathcal", output:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"script", type:UNARY },
	{ input:"mathfrak", output:"mathfrak", tag:"mstyle", atname:"mathvariant", atval:"fraktur", type:UNARY},
	
	
	// ASCIIMathML Notation
	
	// Greek Letters
	{ input:"epsi", output:"epsilon", type:ALIAS },
	
	// Binary Operation Symbols
	{ input:"*", output:"cdot", type:ALIAS },
	{ input:"**", output:"star", type:ALIAS },
	{ input:"\\\\", output:"backslash", type:ALIAS },
	{ input:"xx", output:"times", type:ALIAS },
	{ input:"-:", output:"div", type:ALIAS },
	{ input:"@", output:"circ", type:ALIAS },
	{ input:"o+", output:"oplus", type:ALIAS },
	{ input:"ox", output:"otimes", type:ALIAS },
	{ input:"o.", output:"odot", type:ALIAS },
	{ input:"^^", output:"wedge", type:ALIAS },
	{ input:"^^^", output:"bigwedge", type:ALIAS },
	{ input:"vv", output:"vee", type:ALIAS },
	{ input:"vvv", output:"bigvee", type:ALIAS },
	{ input:"nn", output:"cap", type:ALIAS },
	{ input:"nnn", output:"bigcap", type:ALIAS },
	{ input:"uu", output:"cup", type:ALIAS },
	{ input:"uuu", output:"bigcup", type:ALIAS },
	
	// Binary Relation Symbols
	{ input:"!=", output:"ne", type:ALIAS },
	{ input:"<=", output:"le", type:ALIAS },
	{ input:">=", output:"ge", type:ALIAS },
	{ input:"-<", output:"prec", type:ALIAS },
	{ input:">-", output:"succ", type:ALIAS },
	{ input:"-<=", output:"preceq", type:ALIAS },
	{ input:">-=", output:"succeq", type:ALIAS },
	{ input:"!in", output:"notin", type:ALIAS },
	{ input:"sub", output:"subset", type:ALIAS },
	{ input:"sup", output:"supset", type:ALIAS },
	{ input:"sube", output:"subseteq", type:ALIAS },
	{ input:"supe", output:"supseteq", type:ALIAS },
	{ input:"-=", output:"equiv", type:ALIAS },
	{ input:"~=", output:"cong", type:ALIAS },
	{ input:"~~", output:"approx", type:ALIAS },
	{ input:"prop", output:"propto", type:ALIAS },
	
	// Logical Symbols
	{ input:"and", tag:"mtext", output:"and", type:SPACE },
	{ input:"or", tag:"mtext", output:"or", type:SPACE },
	{ input:"if", tag:"mo", output:"if", type:SPACE },
	{ input:"not", output:"neg", type:ALIAS },
	{ input:"=>", output:"Rightarrow", type:ALIAS },
	{ input:"<=>", output:"iff", type:CONSTANT },
	{ input:"AA", output:"forall", type:ALIAS },
	{ input:"EE", output:"exists", type:ALIAS },
	{ input:"_|_", output:"bot", type:ALIAS },
	{ input:"TT", output:"top", type:ALIAS },
	{ input:"|--", output:"vdash", type:ALIAS },
	{ input:"|==", output:"models", type:ALIAS },
	
	// Grouping Brackets
	{ input:"(:", output:"langle", type:ALIAS },
	{ input:":)", output:"rangle", type:ALIAS },
	{ input:"||", output:"||", tag:"mo", type:LEFTBRACKET },
	{ input:"<<", output:"\u2329", tag:"mo", type:LEFTBRACKET },
	{ input:">>", output:"\u232A", tag:"mo", type:RIGHTBRACKET },
	{ input:"{:", output:"", type:LEFTBRACKET },
	{ input:":}", output:"", type:RIGHTBRACKET },
	
	// Miscellaneous Symbols
	{ input:"dx", output:"mathrm{d} x", type:ALIAS },
	{ input:"dy", output:"mathrm{d} y", type:ALIAS },
	{ input:"dz", output:"mathrm{d} z", type:ALIAS },
	{ input:"dt", output:"mathrm{d} t", type:ALIAS },
	{ input:"del", output:"partial", type:ALIAS },
	{ input:"grad", output:"nabla", type:ALIAS },
	{ input:"+-", output:"pm", type:ALIAS },
	{ input:"O/", output:"emptyset", type:ALIAS },
	{ input:"oo", output:"infty", type:ALIAS },
	{ input:"...", output:"ldots", type:ALIAS },
	{ input:":.", output:"therefore", type:ALIAS },
	{ input:"/_", output:"angle", type:ALIAS },
//	{ input:"\\ ", tag:"mo", output:"\u00A0", type:CONSTANT },
//	{ input:"quad", tag:"mo", output:"\u00A0\u00A0", type:CONSTANT },
//	{ input:"qquad", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0", type:CONSTANT },
	{ input:"|__", output:"lfloor", type:ALIAS },
	{ input:"__|", output:"rfloor", type:ALIAS },
	{ input:"|~", output:"lceiling", type:ALIAS },
	{ input:"~|", output:"rceiling", type:ALIAS },
	{ input:"CC", output:"\u2102", tag:"mo", type:CONSTANT },
	{ input:"NN", output:"\u2115", tag:"mo", type:CONSTANT },
	{ input:"QQ", output:"\u211A", tag:"mo", type:CONSTANT },
	{ input:"RR", output:"\u211D", tag:"mo", type:CONSTANT },
	{ input:"ZZ", output:"\u2124", tag:"mo", type:CONSTANT },
	
	// Arrows
	{ input:"uarr", output:"uparrow", type:ALIAS },
	{ input:"darr", output:"downarrow", type:ALIAS },
	{ input:"rarr", output:"rightarrow", type:ALIAS },
	{ input:"->", output:"to", type:ALIAS },
	{ input:">->", output:"rightarrowtail", type:ALIAS },
	{ input:"->>", output:"twoheadrightarrow", type:ALIAS },
	{ input:">->>", output:"twoheadrightarrowtail", type:ALIAS },
	{ input:"|->", output:"mapsto", type:ALIAS },
	{ input:"larr", output:"leftarrow", type:ALIAS },
	{ input:"harr", output:"leftrightarrow", type:ALIAS },
	{ input:"rArr", output:"Rightarrow", type:ALIAS },
	{ input:"lArr", output:"Leftarrow", type:ALIAS },
	{ input:"hArr", output:"Leftrightarrow", type:ALIAS },
	
	// Commands With Argument
	{ input:"/", output:"/", tag:"mfrac", type:INFIX },
	{ input:"hat", output:"\u005E", tag:"mover", type:UNARY, acc:true },
	// { input:"vec", output:"\u2192", tag:"mover", type:UNARY, acc:true },
	{ input:"ul", output:"underline", type:ALIAS },
	{ input:"text", output:"text", tag:"mtext", type:TEXT },
	{ input:"\"", output:"mbox", tag:"mtext", type:TEXT },
	{ input:"bb", output:"bb", tag:"mstyle", atname:"mathvariant", atval:"bold", type:UNARY },
	{ input:"sf", output:"sf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", type:UNARY },
	//{ input:"bbb", output:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", type:UNARY },
	{ input:"cc", output:"cc", tag:"mstyle", atname:"mathvariant", atval:"script", type:UNARY },
	{ input:"tt", output:"tt", tag:"mstyle", atname:"mathvariant", atval:"monospace", type:UNARY },
	{ input:"fr", output:"fr", tag:"mstyle", atname:"mathvariant", atval:"fraktur", type:UNARY },
	{ input:"bold", output:"bb", tag:"mstyle", atname:"mathvariant", atval:"bold-italic", type:UNARY },
	
	// Others
	{ input:"divide", output:"div", type:ALIAS },
	{ input:"implies", output:"Rightarrow", type:ALIAS },
	{ input:"slash", output:"/", tag:"mo", type:CONSTANT },
	{ input:"backslash", output:"\\", tag:"mo", type:CONSTANT },
	{ input:"underbar", output:"_", tag:"mo", type:CONSTANT },
	{ input:"integral", output:"int_{}^{}", type:ALIAS },
	{ input:"notequal", output:"ne", type:ALIAS },
	{ input:"plusminus", output:"pm", type:ALIAS },
	{ input:"minusplus", output:"mp", type:ALIAS },
	{ input:"-+", output:"mp", type:ALIAS },
	{ input:"bi", output:"bi", tag:"mstyle", atname:"mathvariant", atval:"bold-italic", type:UNARY },
	{ input:"plus", output:"+", tag:"mo", type:CONSTANT },
	{ input:"minus", output:"-", tag:"mo", type:CONSTANT },
	{ input:"equal", output:"=", tag:"mo", type:CONSTANT },
	{ input:"fraction", output:"frac", type:ALIAS },
	{ input:"subscript", output:"subscript", type:SUBSCRIPT },
	{ input:"superscript", output:"superscript", type:SUPERSCRIPT },
	{ input:"matrix", output:"matrix", type:MATRIX },
	{ input:"mat", output:"matrix", type:ALIAS },
	{ input:"vector", output:"vector", type:VECTOR },
	{ input:"simuleqs", output:"simuleqs", type:SIMULEQUATIONS },
	{ input:"simul", output:"simuleqs", type:ALIAS },
	{ input:"bra", output:"langle", type:ALIAS },
	{ input:"ket", output:"rangle", type:ALIAS }
	
	];
	
	
	
	var alias = [
	
	{ input:"QuadraticFormula", output:"x={-b+-root{b^2-4ac}}/{2a}", type:ALIAS }
	
	];
	
	
	var sentence = [
	
	{ input:"sinalpha", type:SENTENCE },
	{ input:"sinbeta", type:SENTENCE },
	{ input:"sintheta", type:SENTENCE },
	{ input:"cosalpha", type:SENTENCE },
	{ input:"cosbeta", type:SENTENCE },
	{ input:"costheta", type:SENTENCE },
	
	];
	
	
	var jp = [

	{ input:"sekibun", output:"int", type:ALIAS },
	{ input:"henbibun", output:"partial", type:ALIAS },
	{ input:"mugen", output:"infty", type:ALIAS },
	{ input:"yajirushi", output:"to", type:ALIAS },
	{ input:"kaku", output:"angle", type:ALIAS },
	{ input:"kongou", output:"sqrt", type:ALIAS },
	{ input:"kongo", output:"sqrt", type:ALIAS },
	{ input:"tasu", output:"plus", type:ALIAS },
	{ input:"hiku", output:"minus", type:ALIAS },
	{ input:"kakeru", output:"times", type:ALIAS },
	{ input:"bunsu", output:"frac", type:ALIAS },
	{ input:"bunnsu", output:"frac", type:ALIAS },
	{ input:"bunsuu", output:"frac", type:ALIAS },
	{ input:"bunnsuu", output:"frac", type:ALIAS },
	{ input:"gyouretsu", output:"matrix", type:ALIAS },
	{ input:"gyouretu", output:"matrix", type:ALIAS },
	{ input:"gyoretsu", output:"matrix", type:ALIAS },
	{ input:"gyoretu", output:"matrix", type:ALIAS },
	{ input:"rennritsu", output:"simuleqs", type:ALIAS },
	{ input:"renritsu", output:"simuleqs", type:ALIAS },
	{ input:"rennritu", output:"simuleqs", type:ALIAS },
	{ input:"renritu", output:"simuleqs", type:ALIAS },
	// { input:"bekutoru", output:"vector", type:ALIAS },
	{ input:"supscript", output:"superscript", type:ALIAS },
	{ input:"ruijou", output:"superscript", type:ALIAS },
	{ input:"ruijo", output:"superscript", type:ALIAS },
	{ input:"soeji", output:"subscript", type:ALIAS },
	{ input:"teisekibun", output:"int_{}^{}", type:ALIAS }
	
	];
	
	symbols = symbols.concat( alias );
	symbols = symbols.concat( sentence );
	symbols = symbols.concat( jp );
	
	symbols.sort( function ( s1, s2 )
	{
		if ( s1.input > s2.input ) {
			return 1
		}
		else {
			return -1;
		}
	});
	
	var names = [];
	
	for ( var i = 0; i < symbols.length; i++ ) {
		names[ i ] = symbols[ i ].input;
	}
	
	function findPosition( arr, str, n ) {
		if ( n == 0 ) {
			var h, m;
			n = -1;
			h = arr.length;
			while ( n + 1 < h ) {
				m = ( n + h ) >> 1;
				if ( arr[ m ] < str ) {
					n = m;
				}
				else {
					h = m;
				}
			}
			return h;
		}
		else {
			for ( var i = n; i < arr.length && arr[ i ] < str; i++);
			return i;
		}
	}
	
	function getSymbol( str, option )
	{
		var newPos = 0;
		var oldPos = 0;
		var matchPos;
		var subStr;
		var tag;
		var match;
		var more = true;
		
		for ( var i = 1; i <= str.length && more; i++ ) {
			subStr = str.slice( 0, i );
			oldPos = newPos;
			newPos = findPosition( names, subStr, oldPos );
			if ( option ) {
				if ( newPos < names.length && str.slice( 0, names[ newPos ].length ) ==  names[ newPos ] && symbols[ newPos ].type != option ) {
					match =  names[ newPos ];
					matchPos = newPos;
					i = match.length;
				}
			}
			else {
				if ( newPos < names.length && str.slice( 0, names[ newPos ].length ) ==  names[ newPos ] ) {
					match =  names[ newPos ];
					matchPos = newPos;
					i = match.length;
				}
			}
			more = ( newPos < names.length && str.slice( 0, names[ newPos ].length) >=  names[ newPos ] );
		}
		
		if ( match ) {
			return  symbols[ matchPos ];
		}
		else {
			var i = 1;
			subStr = str.slice( 0, 1 );
			var integer = true;
			while ( '0' <= subStr && subStr <= '9' && i <= str.length ) {
				subStr = str.slice( i, i + 1 );
				i++;
			}
			if ( subStr == '.' ) {
				subStr = str.slice( i, i + 1 );
				if ( '0' <= subStr && subStr <= '9' ) {
					integer = false;
					i++;
					while ( '0' <= subStr && subStr <= '9' && i <= str.length ) {
						subStr = str.slice( i, i + 1 );
						i++;
					}
				}
			}
			if ( ( integer && i > 1 ) || i > 2 ) {
				subStr = str.slice( 0, i - 1 );
				tag = 'mn';
			}
			else {
				subStr = str.slice( 0, 1 );
				tag = ( ( 'A' > subStr || subStr > 'Z' ) && ( 'a' > subStr || subStr > 'z' ) ? 'mo' : 'mi' );
			}
			return { input:subStr, tag:tag, output:subStr, type:CONSTANT };
		}
	}
	
	function getSubsequentSymbols( str )
	{
		var subsequentSymbols = new Object();
		// sentences = new Array();
		var start = findPosition( names, str, 0 );
		for ( var i = start; i < names.length && names[ i ].slice( 0, str.length ) ==  str; i++ ) {
			if ( symbols[ i ].atval || symbols[ i ].type == TEXT ) { continue; }
			if ( symbols[ i ].type == SENTENCE ) {
				subsequentSymbols[ names[ i ] ] = names[ i ];
				// sentences.push( names[ i ] );
			}
			else {
				subsequentSymbols[ symbols[ i ].output ] = names[ i ];
			}
		}
		return subsequentSymbols;
		
		// タイプがSENTENCEのものは別処理すべきか
		// return [ subsequentSymbols, sentences ];
	}
	
	return {
		getSymbol: getSymbol,
		getSubsequentSymbols: getSubsequentSymbols,
		CONSTANT: CONSTANT,
		UNARY: UNARY,
		BINARY: BINARY,
		INFIX: INFIX,
		UNDEROVER: UNDEROVER,
		LEFTBRACKET: LEFTBRACKET,
		RIGHTBRACKET: RIGHTBRACKET,
		SPACE: SPACE,
		TEXT: TEXT,
		ALIAS: ALIAS,
		SUBSCRIPT: SUBSCRIPT,
		SUPERSCRIPT: SUPERSCRIPT,
		VECTOR: VECTOR,
		MATRIX: MATRIX,
		SIMULEQUATIONS: SIMULEQUATIONS,
		SENTENCE: SENTENCE
	}
	
})();