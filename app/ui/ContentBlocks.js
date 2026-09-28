import Link from "next/link";
export default function ContentBlocks({blocks=[]}){return <>{(Array.isArray(blocks)?blocks:[]).filter(b=>b?.active!==false).map((b,i)=><section className={`customBlock customBlock-${b.type||"text"}`} key={b.id||i}>
 {b.type==="heading"&&<div><span className="sectionTag">{b.eyebrow||"NEXORA"}</span><h2>{b.title}</h2>{b.text&&<p>{b.text}</p>}</div>}
 {b.type==="image"&&b.url&&<div><img src={b.url} alt={b.alt||"Nexora"}/>{b.text&&<p>{b.text}</p>}</div>}
 {b.type==="button"&&<Link className="primary" href={b.href||"/contact"}>{b.title||"Découvrir"}</Link>}
 {(!b.type||b.type==="text")&&<div><h3>{b.title}</h3><p>{b.text||""}</p></div>}
 {b.type==="divider"&&<div className="customDivider"/>}
 </section>)} </>}
