function qNb(a){var b,c;b=Qlb(a.b.qe(Dbd),149);if(b==null){c=Glb(mIb,S2c,1,[Ebd,Fbd,Gbd,Hbd]);a.b.se(Dbd,c);return c}else{return b}}
function rNb(a){var b,c;b=Qlb(a.b.qe(Ibd),149);if(b==null){c=Glb(mIb,S2c,1,[Jbd,Kbd,Lbd,Mbd,Nbd,Obd]);a.b.se(Ibd,c);return c}else{return b}}
function Y8b(a){var b,c,d,e,f,g,i;i=new BMc;yMc(i,new dxc('<b>Select your favorite color:<\/b>'));c=qNb(a.b);for(d=0;d<c.length;++d){b=c[d];e=new xGc(y8c,b);Usc(e,'cwRadioButton-color-'+b);d==2&&(e.d.disabled=true,bj(e,jj(e.db)+N8c,true));yMc(i,e)}yMc(i,new dxc('<br><b>Select your favorite sport:<\/b>'));g=rNb(a.b);for(d=0;d<g.length;++d){f=g[d];e=new xGc('sport',f);Usc(e,'cwRadioButton-sport-'+cVc(f,y4c,m5c));d==2&&Vsc(e,(yTc(),yTc(),xTc));yMc(i,e)}return i}
var Dbd='cwRadioButtonColors',Ibd='cwRadioButtonSports';oJb(878,1,F3c);_.qc=function c9b(){TLb(this.c,Y8b(this.b))};s4c(Jn)(1);