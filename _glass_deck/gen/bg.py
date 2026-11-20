import zlib,struct
W,H=1600,900
def lerp(a,b,t): return tuple(a[i]+(b[i]-a[i])*t for i in range(3))
peach=(250,232,204); mint=(197,235,221); mid=(238,240,244); blue=(184,208,247); lav=(210,200,245)
rows=[]
for y in range(H):
    v=y/(H-1)
    L=lerp(peach,mint,v); R=lerp(blue,lav,v)
    row=bytearray([0])
    for x in range(W):
        t=x/(W-1)
        if t<0.5:
            s=t/0.5; s=s*s*(3-2*s); c=lerp(L,mid,s)
        else:
            s=(t-0.5)/0.5; s=s*s*(3-2*s); c=lerp(mid,R,s)
        row+=bytes(int(round(k)) for k in c)
    rows.append(bytes(row))
raw=b''.join(rows)
def ch(t,d): 
    c=struct.pack('>I',len(d))+t+d
    return c+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
open('bg.png','wb').write(b'\x89PNG\r\n\x1a\n'+ch(b'IHDR',struct.pack('>IIBBBBB',W,H,8,2,0,0,0))+ch(b'IDAT',zlib.compress(raw,6))+ch(b'IEND',b''))
