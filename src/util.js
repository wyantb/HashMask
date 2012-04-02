/*
 * A JavaScript implementation of the RIPEMD-160 Algorithm
 * Version 2.2 Copyright Jeremy Lin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://www.ocf.berkeley.edu/~jjlin/jsotp/
 *
 * Usage: rstr_rmd160("string");
 *
 */

var hexcase=0;var b64pad="";function hex_rmd160(s){return rstr2hex(rstr_rmd160(str2rstr_utf8(s)));}
function b64_rmd160(s){return rstr2b64(rstr_rmd160(str2rstr_utf8(s)));}
function any_rmd160(s,e){return rstr2any(rstr_rmd160(str2rstr_utf8(s)),e);}
function hex_hmac_rmd160(k,d)
{return rstr2hex(rstr_hmac_rmd160(str2rstr_utf8(k),str2rstr_utf8(d)));}
function b64_hmac_rmd160(k,d)
{return rstr2b64(rstr_hmac_rmd160(str2rstr_utf8(k),str2rstr_utf8(d)));}
function any_hmac_rmd160(k,d,e)
{return rstr2any(rstr_hmac_rmd160(str2rstr_utf8(k),str2rstr_utf8(d)),e);}
function rmd160_vm_test()
{return hex_rmd160("abc").toLowerCase()=="8eb208f7e05d987a9b044a8e98c6b087f15a0bfc";}
function rstr_rmd160(s)
{return binl2rstr(binl_rmd160(rstr2binl(s),s.length*8));}
function rstr_hmac_rmd160(key,data)
{var bkey=rstr2binl(key);if(bkey.length>16)bkey=binl_rmd160(bkey,key.length*8);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++)
{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=binl_rmd160(ipad.concat(rstr2binl(data)),512+data.length*8);return binl2rstr(binl_rmd160(opad.concat(hash),512+160));}
function rstr2hex(input)
{try{hexcase}catch(e){hexcase=0;}
var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var output="";var x;for(var i=0;i<input.length;i++)
{x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)
+hex_tab.charAt(x&0x0F);}
return output;}
function rstr2b64(input)
{try{b64pad}catch(e){b64pad='';}
var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var output="";var len=input.length;for(var i=0;i<len;i+=3)
{var triplet=(input.charCodeAt(i)<<16)|(i+1<len?input.charCodeAt(i+1)<<8:0)|(i+2<len?input.charCodeAt(i+2):0);for(var j=0;j<4;j++)
{if(i*8+j*6>input.length*8)output+=b64pad;else output+=tab.charAt((triplet>>>6*(3-j))&0x3F);}}
return output;}
function rstr2any(input,encoding)
{var divisor=encoding.length;var remainders=Array();var i,q,x,quotient;var dividend=Array(Math.ceil(input.length/2));for(i=0;i<dividend.length;i++)
{dividend[i]=(input.charCodeAt(i*2)<<8)|input.charCodeAt(i*2+1);}
while(dividend.length>0)
{quotient=Array();x=0;for(i=0;i<dividend.length;i++)
{x=(x<<16)+dividend[i];q=Math.floor(x/divisor);x-=q*divisor;if(quotient.length>0||q>0)
quotient[quotient.length]=q;}
remainders[remainders.length]=x;dividend=quotient;}
var output="";for(i=remainders.length-1;i>=0;i--)
output+=encoding.charAt(remainders[i]);var full_length=Math.ceil(input.length*8/(Math.log(encoding.length)/Math.log(2)))
for(i=output.length;i<full_length;i++)
output=encoding[0]+output;return output;}
function str2rstr_utf8(input)
{var output="";var i=-1;var x,y;while(++i<input.length)
{x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF)
{x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}
if(x<=0x7F)
output+=String.fromCharCode(x);else if(x<=0x7FF)
output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)
output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)
output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));}
return output;}
function str2rstr_utf16le(input)
{var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode(input.charCodeAt(i)&0xFF,(input.charCodeAt(i)>>>8)&0xFF);return output;}
function str2rstr_utf16be(input)
{var output="";for(var i=0;i<input.length;i++)
output+=String.fromCharCode((input.charCodeAt(i)>>>8)&0xFF,input.charCodeAt(i)&0xFF);return output;}
function rstr2binl(input)
{var output=Array(input.length>>2);for(var i=0;i<output.length;i++)
output[i]=0;for(var i=0;i<input.length*8;i+=8)
output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32);return output;}
function binl2rstr(input)
{var output="";for(var i=0;i<input.length*32;i+=8)
output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF);return output;}
function binl_rmd160(x,len)
{x[len>>5]|=0x80<<(len%32);x[(((len+64)>>>9)<<4)+14]=len;var h0=0x67452301;var h1=0xefcdab89;var h2=0x98badcfe;var h3=0x10325476;var h4=0xc3d2e1f0;for(var i=0;i<x.length;i+=16){var T;var A1=h0,B1=h1,C1=h2,D1=h3,E1=h4;var A2=h0,B2=h1,C2=h2,D2=h3,E2=h4;for(var j=0;j<=79;++j){T=safe_add(A1,rmd160_f(j,B1,C1,D1));T=safe_add(T,x[i+rmd160_r1[j]]);T=safe_add(T,rmd160_K1(j));T=safe_add(bit_rol(T,rmd160_s1[j]),E1);A1=E1;E1=D1;D1=bit_rol(C1,10);C1=B1;B1=T;T=safe_add(A2,rmd160_f(79-j,B2,C2,D2));T=safe_add(T,x[i+rmd160_r2[j]]);T=safe_add(T,rmd160_K2(j));T=safe_add(bit_rol(T,rmd160_s2[j]),E2);A2=E2;E2=D2;D2=bit_rol(C2,10);C2=B2;B2=T;}
T=safe_add(h1,safe_add(C1,D2));h1=safe_add(h2,safe_add(D1,E2));h2=safe_add(h3,safe_add(E1,A2));h3=safe_add(h4,safe_add(A1,B2));h4=safe_add(h0,safe_add(B1,C2));h0=T;}
return[h0,h1,h2,h3,h4];}
function rmd160_f(j,x,y,z)
{return(0<=j&&j<=15)?(x^y^z):(16<=j&&j<=31)?(x&y)|(~x&z):(32<=j&&j<=47)?(x|~y)^z:(48<=j&&j<=63)?(x&z)|(y&~z):(64<=j&&j<=79)?x^(y|~z):"rmd160_f: j out of range";}
function rmd160_K1(j)
{return(0<=j&&j<=15)?0x00000000:(16<=j&&j<=31)?0x5a827999:(32<=j&&j<=47)?0x6ed9eba1:(48<=j&&j<=63)?0x8f1bbcdc:(64<=j&&j<=79)?0xa953fd4e:"rmd160_K1: j out of range";}
function rmd160_K2(j)
{return(0<=j&&j<=15)?0x50a28be6:(16<=j&&j<=31)?0x5c4dd124:(32<=j&&j<=47)?0x6d703ef3:(48<=j&&j<=63)?0x7a6d76e9:(64<=j&&j<=79)?0x00000000:"rmd160_K2: j out of range";}
var rmd160_r1=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];var rmd160_r2=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];var rmd160_s1=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];var rmd160_s2=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];function safe_add(x,y)
{var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
function bit_rol(num,cnt)
{return(num<<cnt)|(num>>>(32-cnt));}

/* 
*
*  Whirlpool Hashing Function 
*  v3.0 ~ Sean Catchpole 
*  Copyright 2009 Public Domain
* 
*  Usage: Whirlpool("string");
*
*/
(function(){var D,h=10,u=[],w=[],q,p,B,v,A,f,e,b,a,G,F,s="\u1823\uc6E8\u87B8\u014F\u36A6\ud2F5\u796F\u9152\u60Bc\u9B8E\uA30c\u7B35\u1dE0\ud7c2\u2E4B\uFE57\u1577\u37E5\u9FF0\u4AdA\u58c9\u290A\uB1A0\u6B85\uBd5d\u10F4\ucB3E\u0567\uE427\u418B\uA77d\u95d8\uFBEE\u7c66\udd17\u479E\ucA2d\uBF07\uAd5A\u8333\u6302\uAA71\uc819\u49d9\uF2E3\u5B88\u9A26\u32B0\uE90F\ud580\uBEcd\u3448\uFF7A\u905F\u2068\u1AAE\uB454\u9322\u64F1\u7312\u4008\uc3Ec\udBA1\u8d3d\u9700\ucF2B\u7682\ud61B\uB5AF\u6A50\u45F3\u30EF\u3F55\uA2EA\u65BA\u2Fc0\udE1c\uFd4d\u9275\u068A\uB2E6\u0E1F\u62d4\uA896\uF9c5\u2559\u8472\u394c\u5E78\u388c\ud1A5\uE261\uB321\u9c1E\u43c7\uFc04\u5199\u6d0d\uFAdF\u7E24\u3BAB\ucE11\u8F4E\uB7EB\u3c81\u94F7\uB913\u2cd3\uE76E\uc403\u5644\u7FA9\u2ABB\uc153\udc0B\u9d6c\u3174\uF646\uAc89\u14E1\u163A\u6909\u70B6\ud0Ed\ucc42\u98A4\u285c\uF886";for(q=8;q-->0;){u[q]=[]}for(p=0;p<256;p++){B=s.charCodeAt(p/2);f=((p&1)==0)?B>>>8:B&255;e=f<<1;if(e>=256){e^=285}b=e<<1;if(b>=256){b^=285}a=b^f;G=b<<1;if(G>=256){G^=285}F=G^f;u[0][p]=[0,0];u[0][p][0]=(f<<24)|(f<<16)|(b<<8)|(f);u[0][p][1]=(G<<24)|(a<<16)|(e<<8)|(F);for(var q=1;q<8;q++){u[q][p]=[0,0];u[q][p][0]=(u[q-1][p][0]>>>8)|((u[q-1][p][1]<<24));u[q][p][1]=(u[q-1][p][1]>>>8)|((u[q-1][p][0]<<24))}}w[0]=[0,0];for(v=1;v<=h;v++){A=8*(v-1);w[v]=[0,0];w[v][0]=(u[0][A][0]&4278190080)^(u[1][A+1][0]&16711680)^(u[2][A+2][0]&65280)^(u[3][A+3][0]&255);w[v][1]=(u[4][A+4][1]&4278190080)^(u[5][A+5][1]&16711680)^(u[6][A+6][1]&65280)^(u[7][A+7][1]&255)}var z=[],y=[],n=0,j=0,d=[],o=[],m=[],l=[],g=[];var E=function(){var C,c,I,H,x;for(C=0,c=0;C<8;C++,c+=8){l[C]=[0,0];l[C][0]=((y[c]&255)<<24)^((y[c+1]&255)<<16)^((y[c+2]&255)<<8)^((y[c+3]&255));l[C][1]=((y[c+4]&255)<<24)^((y[c+5]&255)<<16)^((y[c+6]&255)<<8)^((y[c+7]&255))}for(C=0;C<8;C++){g[C]=[0,0];o[C]=[0,0];g[C][0]=l[C][0]^(o[C][0]=d[C][0]);g[C][1]=l[C][1]^(o[C][1]=d[C][1])}for(I=1;I<=h;I++){for(C=0;C<8;C++){m[C]=[0,0];for(x=0,H=56,c=0;x<8;x++,H-=8,c=H<32?1:0){m[C][0]^=u[x][(o[(C-x)&7][c]>>>(H%32))&255][0];m[C][1]^=u[x][(o[(C-x)&7][c]>>>(H%32))&255][1]}}for(C=0;C<8;C++){o[C][0]=m[C][0];o[C][1]=m[C][1]}o[0][0]^=w[I][0];o[0][1]^=w[I][1];for(C=0;C<8;C++){m[C][0]=o[C][0];m[C][1]=o[C][1];for(x=0,H=56,c=0;x<8;x++,H-=8,c=H<32?1:0){m[C][0]^=u[x][(g[(C-x)&7][c]>>>(H%32))&255][0];m[C][1]^=u[x][(g[(C-x)&7][c]>>>(H%32))&255][1]}}for(C=0;C<8;C++){g[C][0]=m[C][0];g[C][1]=m[C][1]}}for(C=0;C<8;C++){d[C][0]^=g[C][0]^l[C][0];d[C][1]^=g[C][1]^l[C][1]}};D=Whirlpool=function(c){return D.init().add(c).finalize()};D.version="3.0";D.init=function(){for(var c=32;c-->0;){z[c]=0}n=j=0;y=[0];for(c=8;c-->0;){d[c]=[0,0]}return D};var k=function(r){var c,x,t=r.toString();r=[];for(c=0;c<t.length;c++){x=t.charCodeAt(c);if(x>=256){r.push(x>>>8&255)}r.push(x&255)}return r};D.add=function(c,K){if(!c){return D}if(!K){c=k(c);K=c.length*8}var r=0,t=(8-(K&7))&7,C=n&7,x,H,J,I=K;for(x=31,J=0;x>=0;x--){J+=(z[x]&255)+(I%256);z[x]=J&255;J>>>=8;I=Math.floor(I/256)}while(K>8){H=((c[r]<<t)&255)|((c[r+1]&255)>>>(8-t));if(H<0||H>=256){return"Whirlpool requires a byte array"}y[j++]|=H>>>C;n+=8-C;if(n==512){E();n=j=0;y=[]}y[j]=((H<<(8-C))&255);n+=C;K-=8;r++}if(K>0){H=(c[r]<<t)&255;y[j]|=H>>>C}else{H=0}if(C+K<8){n+=K}else{j++;n+=8-C;K-=8-C;if(n==512){E();n=j=0;y=[]}y[j]=((H<<(8-C))&255);n+=K}return D};D.finalize=function(){var r,c,t,H="",C=[],x="0123456789ABCDEF".split("");y[j]|=128>>>(n&7);j++;if(j>32){while(j<64){y[j++]=0}E();j=0;y=[]}while(j<32){y[j++]=0}y.push.apply(y,z);E();for(r=0,c=0;r<8;r++,c+=8){t=d[r][0];C[c]=t>>>24&255;C[c+1]=t>>>16&255;C[c+2]=t>>>8&255;C[c+3]=t&255;t=d[r][1];C[c+4]=t>>>24&255;C[c+5]=t>>>16&255;C[c+6]=t>>>8&255;C[c+7]=t&255}for(r=0;r<C.length;r++){H+=x[C[r]>>>4];H+=x[C[r]&15]}return H}})();


/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
*  Minified, obviously
*
*  Usage: SHA256("string")
*
**/
function SHA256(s){var chrsz=8;var hexcase=0;function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}function S(X,n){return(X>>>n)|(X<<(32-n));}function R(X,n){return(X>>>n);}function Ch(x,y,z){return((x&y)^((~x)&z));}function Maj(x,y,z){return((x&y)^(x&z)^(y&z));}function Sigma0256(x){return(S(x,2)^S(x,13)^S(x,22));}function Sigma1256(x){return(S(x,6)^S(x,11)^S(x,25));}function Gamma0256(x){return(S(x,7)^S(x,18)^R(x,3));}function Gamma1256(x){return(S(x,17)^S(x,19)^R(x,10));}function core_sha256(m,l){var K=new Array(0x428A2F98,0x71374491,0xB5C0FBCF,0xE9B5DBA5,0x3956C25B,0x59F111F1,0x923F82A4,0xAB1C5ED5,0xD807AA98,0x12835B01,0x243185BE,0x550C7DC3,0x72BE5D74,0x80DEB1FE,0x9BDC06A7,0xC19BF174,0xE49B69C1,0xEFBE4786,0xFC19DC6,0x240CA1CC,0x2DE92C6F,0x4A7484AA,0x5CB0A9DC,0x76F988DA,0x983E5152,0xA831C66D,0xB00327C8,0xBF597FC7,0xC6E00BF3,0xD5A79147,0x6CA6351,0x14292967,0x27B70A85,0x2E1B2138,0x4D2C6DFC,0x53380D13,0x650A7354,0x766A0ABB,0x81C2C92E,0x92722C85,0xA2BFE8A1,0xA81A664B,0xC24B8B70,0xC76C51A3,0xD192E819,0xD6990624,0xF40E3585,0x106AA070,0x19A4C116,0x1E376C08,0x2748774C,0x34B0BCB5,0x391C0CB3,0x4ED8AA4A,0x5B9CCA4F,0x682E6FF3,0x748F82EE,0x78A5636F,0x84C87814,0x8CC70208,0x90BEFFFA,0xA4506CEB,0xBEF9A3F7,0xC67178F2);var HASH=new Array(0x6A09E667,0xBB67AE85,0x3C6EF372,0xA54FF53A,0x510E527F,0x9B05688C,0x1F83D9AB,0x5BE0CD19);var W=new Array(64);var a,b,c,d,e,f,g,h,i,j;var T1,T2;m[l>>5]|=0x80<<(24-l%32);m[((l+64>>9)<<4)+15]=l;for(var i=0;i<m.length;i+=16){a=HASH[0];b=HASH[1];c=HASH[2];d=HASH[3];e=HASH[4];f=HASH[5];g=HASH[6];h=HASH[7];for(var j=0;j<64;j++){if(j<16)W[j]=m[j+i];else W[j]=safe_add(safe_add(safe_add(Gamma1256(W[j-2]),W[j-7]),Gamma0256(W[j-15])),W[j-16]);T1=safe_add(safe_add(safe_add(safe_add(h,Sigma1256(e)),Ch(e,f,g)),K[j]),W[j]);T2=safe_add(Sigma0256(a),Maj(a,b,c));h=g;g=f;f=e;e=safe_add(d,T1);d=c;c=b;b=a;a=safe_add(T1,T2);}HASH[0]=safe_add(a,HASH[0]);HASH[1]=safe_add(b,HASH[1]);HASH[2]=safe_add(c,HASH[2]);HASH[3]=safe_add(d,HASH[3]);HASH[4]=safe_add(e,HASH[4]);HASH[5]=safe_add(f,HASH[5]);HASH[6]=safe_add(g,HASH[6]);HASH[7]=safe_add(h,HASH[7]);}return HASH;}function str2binb(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(24-i%32);}return bin;}function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;}function binb2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8+4))&0xF)+hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8))&0xF);}return str;}s=Utf8Encode(s);return binb2hex(core_sha256(str2binb(s),s.length*chrsz));}

/**
 * *
 * * Secure Hash Algorithm (SHA1)
 * * http://www.webtoolkit.info/
 * *
 * * minified, obviously.
 * *
 * * Usage: SHA1("string")
 * *
 * **/
function SHA1(msg){function rotate_left(n,s){var t4=(n<<s)|(n>>>(32-s));
return t4;};function lsb_hex(val){var str="";var i;var vh;var vl;for(i=0;i<=6;
i+=2){vh=(val>>>(i*4+4))&0x0f;vl=(val>>>(i*4))&0x0f;str+=vh.toString(16)+
vl.toString(16);}return str;};function cvt_hex(val){var str="";var i;var v;
for(i=7;i>=0;i--){v=(val>>>(i*4))&0x0f;str+=v.toString(16);}return str;};
function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";
for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext
+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=
String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);
}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(
((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}return utftext;};
var blockstart;var i,j;var W=new Array(80);var H0=0x67452301;var H1=0xEFCDAB89;
var H2=0x98BADCFE;var H3=0x10325476;var H4=0xC3D2E1F0;var A,B,C,D,E;var temp;
msg=Utf8Encode(msg);var msg_len=msg.length;var word_array=new Array();for(i=0;
i<msg_len-3;i+=4){j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|
msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);word_array.push(j);}
switch(msg_len%4){case 0:i=0x080000000;break;case 1:i=msg.charCodeAt(
msg_len-1)<<24|0x0800000;break;case 2:i=msg.charCodeAt(msg_len-2)<<24|
msg.charCodeAt(msg_len-1)<<16|0x08000;break;case 3:i=msg.charCodeAt(msg_len
-3)<<24|msg.charCodeAt(msg_len-2)<<16|msg.charCodeAt(msg_len-1)<<8|0x80;break;}
word_array.push(i);while((word_array.length%16)!=14)word_array.push(0);
word_array.push(msg_len>>>29);word_array.push((msg_len<<3)&0x0ffffffff);
for(blockstart=0;blockstart<word_array.length;blockstart+=16){for(i=0;i<16;i++)W[i]=word_array[blockstart+i];for(i=16;i<=79;i++)
W[i]=rotate_left(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);A=H0;B=H1;C=H2;D=H3;E=H4;
for(i=0;i<=19;i++){temp=(rotate_left(A,5)+((B&C)|(~B&D))+E+W[i]+0x5A827999)
&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}for(i=20;i<=39;i++)
{temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&0x0ffffffff;E=D;D=C;C=
rotate_left(B,30);B=A;A=temp;}for(i=40;i<=59;i++){temp=(rotate_left(A,5)+
((B&C)|(B&D)|(C&D))+E+W[i]+0x8F1BBCDC)&0x0ffffffff;E=D;D=C;C=rotate_left(B,
30);B=A;A=temp;}for(i=60;i<=79;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]
+0xCA62C1D6)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}H0=(H0+A)
&0x0ffffffff;H1=(H1+B)&0x0ffffffff;H2=(H2+C)&0x0ffffffff;H3=(H3+D)&0x0ffffffff;
H4=(H4+E)&0x0ffffffff;}temp=cvt_hex(H0)+cvt_hex(H1)+cvt_hex(H2)+cvt_hex(
H3)+cvt_hex(H4);return temp.toLowerCase();}
