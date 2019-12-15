#.mcset; 1000
#.labelset; gfx,3000
jmp; loop
@fibs 1,1,0,0,0,0,0,0,0,0
@i 2
@left 0
@right 0
@temp 0
@loop cmp; *i,10
    branch; loopcode,1,0
    jmp; end

    @loopcode set; left,fibs
    plusis; left,*i
    plusis; left,-1

    set; right,fibs
    plusis; right,*i
    plusis; right,-2

    set; temp,fibs
    plusis; temp,*i
    plusis; *temp,**left
    plusis; *temp,**right

    incr; i
    jmp; loop

@end halt;
